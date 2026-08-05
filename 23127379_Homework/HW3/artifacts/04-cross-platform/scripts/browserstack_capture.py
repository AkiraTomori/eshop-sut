#!/usr/bin/env python3
"""Capture authenticated EMS screenshots on BrowserStack Automate.

BrowserStack credentials are read from environment variables or hidden prompts.
They are never written to an artifact.
"""

from __future__ import annotations

import argparse
import base64
import getpass
import json
import os
import sys
import time
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import quote

from selenium import webdriver
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = ROOT / "artifacts/04-cross-platform/screenshots/raw"
SUT_URL = "https://prod-dev.ems-fitus.cloud"
LOGIN_URL = f"{SUT_URL}/login"
B1_URL = f"{SUT_URL}/dashboard"
B4_URL = f"{SUT_URL}/profile"
EMS_EMAIL = "23127379@student.hcmus.edu.vn"
EMS_PASSWORD = "Minhhuy1407@"


@dataclass(frozen=True)
class MatrixCell:
    cell_id: str
    target_os: str
    browser: str
    device_class: str
    width: int
    height: int
    capabilities: dict[str, Any]


MATRIX = [
    MatrixCell("C01", "Windows 11", "Chrome", "Desktop", 1920, 1080, {
        "browserName": "Chrome",
        "browserVersion": "latest",
        "bstack:options": {"os": "Windows", "osVersion": "11"},
    }),
    MatrixCell("C02", "Windows 11", "Firefox", "Desktop", 1920, 1080, {
        "browserName": "Firefox",
        "browserVersion": "latest",
        "bstack:options": {"os": "Windows", "osVersion": "11"},
    }),
    MatrixCell("C03", "Windows 11", "Edge", "Desktop", 1440, 900, {
        "browserName": "Edge",
        "browserVersion": "latest",
        "bstack:options": {"os": "Windows", "osVersion": "11"},
    }),
    MatrixCell("C04", "macOS Sequoia", "Safari", "Desktop", 1920, 1080, {
        "browserName": "Safari",
        "browserVersion": "latest",
        "bstack:options": {"os": "OS X", "osVersion": "Sequoia"},
    }),
    MatrixCell("C05", "macOS Mojave (Sequoia unavailable)", "Opera 12.15", "Desktop", 1280, 800, {
        "browserName": "Opera",
        "browserVersion": "12.15",
        "bstack:options": {
            "os": "OS X",
            "osVersion": "Mojave",
            "resolution": "1280x1024",
        },
    }),
    MatrixCell("C06", "macOS Sequoia", "Chrome", "Desktop", 1440, 900, {
        "browserName": "Chrome",
        "browserVersion": "latest",
        "bstack:options": {"os": "OS X", "osVersion": "Sequoia"},
    }),
    MatrixCell("C07", "Android 14", "Chrome", "Phone", 390, 844, {
        "browserName": "Chrome",
        "bstack:options": {
            "deviceName": "Samsung Galaxy S24",
            "osVersion": "14.0",
            "realMobile": "true",
        },
    }),
    MatrixCell("C08", "Android 14", "Samsung Internet", "Phone", 360, 800, {
        "browserName": "Samsung",
        "bstack:options": {
            "deviceName": "Samsung Galaxy S24",
            "osVersion": "14.0",
            "realMobile": "true",
        },
    }),
    MatrixCell("C09", "Android 14", "Chrome", "Tablet", 820, 1180, {
        "browserName": "Chrome",
        "bstack:options": {
            "deviceName": "Samsung Galaxy Tab A9 Plus",
            "osVersion": "14.0",
            "realMobile": "true",
        },
    }),
    MatrixCell("C10", "iOS 17", "Safari", "Phone", 390, 844, {
        "browserName": "Safari",
        "bstack:options": {
            "deviceName": "iPhone 15",
            "osVersion": "17",
            "realMobile": "true",
        },
    }),
]


def credentials() -> tuple[str, str]:
    username = os.environ.get("BROWSERSTACK_USERNAME") or input(
        "BrowserStack username: "
    ).strip()
    access_key = os.environ.get("BROWSERSTACK_ACCESS_KEY") or getpass.getpass(
        "BrowserStack access key: "
    )
    if not username or not access_key:
        raise SystemExit("BrowserStack username and access key are required.")
    return username, access_key


def browser_inventory(username: str, access_key: str) -> list[dict[str, Any]]:
    token = base64.b64encode(f"{username}:{access_key}".encode()).decode()
    request = urllib.request.Request(
        "https://api.browserstack.com/automate/browsers.json",
        headers={"Authorization": f"Basic {token}"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def print_relevant_inventory(items: list[dict[str, Any]]) -> None:
    desktop_targets = [
        ("Windows", "11", "chrome"),
        ("Windows", "11", "firefox"),
        ("Windows", "11", "edge"),
        ("OS X", "Sequoia", "safari"),
        ("OS X", "Sequoia", "opera"),
        ("OS X", "Sequoia", "chrome"),
    ]
    summary: dict[str, Any] = {
        "desktop": {},
        "opera_combinations": [],
        "mobile_candidates": [],
    }
    for os_name, os_version, browser in desktop_targets:
        matches = [
            item for item in items
            if item.get("os") == os_name
            and item.get("os_version") == os_version
            and str(item.get("browser", "")).lower() == browser
        ]
        summary["desktop"][f"{os_name} {os_version} / {browser}"] = {
            "available": bool(matches),
            "versions": [item.get("browser_version") for item in matches[-5:]],
        }

    seen = set()
    for item in items:
        os_name = str(item.get("os", "")).lower()
        os_version = str(item.get("os_version", ""))
        device = str(item.get("device") or "")
        include = (
            os_name == "android"
            and os_version == "14.0"
            and ("Galaxy" in device or "Tab" in device)
        ) or (
            os_name == "ios"
            and os_version == "17"
            and "iPhone 15" in device
        )
        key = (
            item.get("os"),
            item.get("os_version"),
            item.get("browser"),
            item.get("device"),
        )
        if include and key not in seen:
            summary["mobile_candidates"].append(item)
            seen.add(key)
    opera = [
        item for item in items
        if str(item.get("browser", "")).lower() == "opera"
    ]
    summary["opera_combinations"] = opera[-20:]
    print(json.dumps(summary, indent=2, ensure_ascii=False))


def options_for(
    cell: MatrixCell, username: str, access_key: str, screen_id: str
):
    caps = json.loads(json.dumps(cell.capabilities))
    bstack = caps.setdefault("bstack:options", {})
    bstack.update({
        "userName": username,
        "accessKey": access_key,
        "projectName": "HW03 EMS Cross-Platform Testing",
        "buildName": f"Scenario B - {screen_id}",
        "sessionName": (
            f"{screen_id} {cell.cell_id} {cell.target_os} {cell.browser}"
        ),
        "debug": "true",
        "networkLogs": "true",
    })

    browser_name = caps.pop("browserName")
    browser_version = caps.pop("browserVersion", None)
    normalized = browser_name.lower()
    if normalized == "firefox":
        options = webdriver.FirefoxOptions()
    elif normalized == "safari":
        options = webdriver.SafariOptions()
    elif normalized in {"edge", "microsoftedge"}:
        options = webdriver.EdgeOptions()
    else:
        options = webdriver.ChromeOptions()
    options.set_capability("browserName", browser_name)
    if browser_version:
        options.set_capability("browserVersion", browser_version)
    for key, value in caps.items():
        options.set_capability(key, value)
    return options


def sanitize_error(error: BaseException, username: str, access_key: str) -> str:
    message = str(error)
    for secret in (username, access_key, quote(username), quote(access_key)):
        message = message.replace(secret, "[REDACTED]")
    return message[:3000]


def login_and_open_screen(driver, screen_id: str) -> None:
    wait = WebDriverWait(driver, 45)
    print("  opening login page", flush=True)
    driver.get(LOGIN_URL)
    print(f"  loaded {driver.current_url}", flush=True)
    email = wait.until(EC.visibility_of_element_located((By.NAME, "email")))
    password = wait.until(EC.visibility_of_element_located((By.NAME, "password")))
    email.clear()
    email.send_keys(EMS_EMAIL)
    password.clear()
    password.send_keys(EMS_PASSWORD)
    strategies = ("click", "enter", "requestSubmit")
    for strategy in strategies:
        email = driver.find_element(By.NAME, "email")
        password = driver.find_element(By.NAME, "password")
        if email.get_attribute("value") != EMS_EMAIL:
            email.clear()
            email.send_keys(EMS_EMAIL)
        if password.get_attribute("value") != EMS_PASSWORD:
            password.clear()
            password.send_keys(EMS_PASSWORD)
        print(f"  submitting EMS login ({strategy})", flush=True)
        if strategy == "click":
            driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        elif strategy == "enter":
            password.send_keys(Keys.ENTER)
        else:
            driver.execute_script(
                "arguments[0].requestSubmit()",
                driver.find_element(By.TAG_NAME, "form"),
            )
        try:
            WebDriverWait(driver, 25).until(
                lambda current: "/dashboard" in current.current_url
            )
            break
        except TimeoutException:
            if strategy == strategies[-1]:
                raise
    print("  login confirmed", flush=True)
    driver.get(B1_URL)
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "main")))
    wait.until(
        EC.visibility_of_element_located(
            (By.CSS_SELECTOR, "main a[href*='/events/']")
        )
    )
    if screen_id == "B2":
        event_links = driver.find_elements(
            By.CSS_SELECTOR, "main a[href*='/events/']"
        )
        event_url = next(
            (
                link.get_attribute("href")
                for link in event_links
                if link.is_displayed() and link.get_attribute("href")
            ),
            None,
        )
        if not event_url:
            raise RuntimeError("No visible published event link was found on B1.")
        print(f"  opening B2 event detail: {event_url}", flush=True)
        driver.get(event_url)
        wait.until(
            lambda current: "/events/" in current.current_url
            and current.current_url.rstrip("/") != f"{SUT_URL}/events"
        )
        wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "main")))
        wait.until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, "main h1, main h2")
            )
        )
    elif screen_id == "B4":
        print(f"  opening B4 profile and QR ticket: {B4_URL}", flush=True)
        driver.get(B4_URL)
        wait.until(
            lambda current: current.current_url.rstrip("/") == B4_URL
        )
        wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "main")))
        qr_trigger = wait.until(
            EC.presence_of_element_located(
                (
                    By.XPATH,
                    "//button[contains(translate(normalize-space(.), "
                    "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
                    "'qr code')]",
                )
            )
        )
        dialog_open = lambda current: current.execute_script(
            "return !!document.querySelector('[role=\"dialog\"],"
            "[aria-modal=\"true\"]')"
        )
        for strategy in ("click", "enter", "javascript"):
            qr_trigger = driver.find_element(
                By.XPATH,
                "//button[contains(translate(normalize-space(.), "
                "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
                "'qr code')]",
            )
            driver.execute_script(
                "arguments[0].scrollIntoView({block: 'center'});", qr_trigger
            )
            print(f"  opening QR dialog ({strategy})", flush=True)
            if strategy == "click":
                qr_trigger.click()
            elif strategy == "enter":
                qr_trigger.send_keys(Keys.ENTER)
            else:
                driver.execute_script("arguments[0].click();", qr_trigger)
            try:
                WebDriverWait(driver, 12).until(dialog_open)
                break
            except TimeoutException:
                if strategy == "javascript":
                    raise
        wait.until(
            EC.visibility_of_element_located(
                (
                    By.XPATH,
                    "//*[contains(normalize-space(.), 'Check-in QR Code')]",
                )
            )
        )
    time.sleep(4)


ANALYSIS_SCRIPT = """
const visible = (el) => {
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
};
const interactive = [...document.querySelectorAll(
  'button,a[href],input,select,textarea,[role="button"],[tabindex]'
)].filter(visible);
const smallTargets = interactive
  .map(el => {
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 80),
      width: Math.round(r.width),
      height: Math.round(r.height)
    };
  })
  .filter(x => x.width < 24 || x.height < 24)
  .slice(0, 30);
const brokenImages = [...document.images]
  .filter(img => visible(img) && (!img.complete || img.naturalWidth === 0))
  .map(img => ({alt: img.alt, src: img.currentSrc || img.src}))
  .slice(0, 30);
const truncatedText = [...document.querySelectorAll('main *')]
  .filter(el => {
    if (!visible(el) || el.children.length || !(el.textContent || '').trim()) return false;
    const s = getComputedStyle(el);
    return (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)
      && (s.overflow === 'hidden' || s.textOverflow === 'ellipsis'
          || s.webkitLineClamp !== 'none');
  })
  .map(el => ({
    tag: el.tagName,
    text: el.textContent.trim().slice(0, 120),
    client: [el.clientWidth, el.clientHeight],
    scroll: [el.scrollWidth, el.scrollHeight]
  }))
  .slice(0, 30);
const dialog = document.querySelector('[role="dialog"],[aria-modal="true"]');
const dialogRect = dialog ? dialog.getBoundingClientRect() : null;
const qrVisual = dialog
  ? [...dialog.querySelectorAll('img,canvas,svg')]
      .filter(visible)
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return (br.width * br.height) - (ar.width * ar.height);
      })[0]
  : null;
const qrRect = qrVisual ? qrVisual.getBoundingClientRect() : null;
return JSON.stringify({
  url: location.href,
  title: document.title,
  viewport: {width: innerWidth, height: innerHeight, dpr: devicePixelRatio},
  document: {
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight
  },
  horizontalOverflow:
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  brokenImages,
  smallTargets,
  truncatedText,
  dialog: dialogRect ? {
    x: Math.round(dialogRect.x),
    y: Math.round(dialogRect.y),
    width: Math.round(dialogRect.width),
    height: Math.round(dialogRect.height),
    fullyWithinViewport:
      dialogRect.left >= 0 && dialogRect.top >= 0
      && dialogRect.right <= innerWidth && dialogRect.bottom <= innerHeight
  } : null,
  qrVisual: qrRect ? {
    tag: qrVisual.tagName,
    width: Math.round(qrRect.width),
    height: Math.round(qrRect.height),
    visible: visible(qrVisual)
  } : null,
  lang: document.documentElement.lang,
  mainText: (document.querySelector('main')?.innerText || '').slice(0, 8000),
  bodyTextHasVietnameseDiacritics:
    /[ăâđêôơưĂÂĐÊÔƠƯàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵ]/.test(document.body.innerText)
});
"""


def capture_cell(
    cell: MatrixCell, username: str, access_key: str, screen_id: str
) -> dict[str, Any]:
    driver = None
    result: dict[str, Any] = {
        "cell": cell.cell_id,
        "target_os": cell.target_os,
        "browser": cell.browser,
        "device_class": cell.device_class,
        "requested_viewport": {"width": cell.width, "height": cell.height},
        "status": "error",
    }
    try:
        result["stage"] = "create-session"
        options = options_for(cell, username, access_key, screen_id)
        driver = webdriver.Remote(
            command_executor="https://hub-cloud.browserstack.com/wd/hub",
            options=options,
        )
        result["session_id"] = driver.session_id
        result["stage"] = "resize"
        if cell.device_class == "Desktop" and not cell.browser.startswith("Opera"):
            driver.set_window_size(cell.width, cell.height)
        result["stage"] = "login-and-navigation"
        login_and_open_screen(driver, screen_id)
        result["stage"] = "dom-analysis"
        analysis = driver.execute_script(ANALYSIS_SCRIPT)
        result["analysis"] = json.loads(analysis) if isinstance(analysis, str) else analysis
        result["tested_url"] = driver.current_url
        result["stage"] = "screenshot"
        path = RAW_DIR / f"{screen_id}_{cell.cell_id}.png"
        if not driver.save_screenshot(str(path)):
            raise RuntimeError("WebDriver returned false while saving screenshot")
        result["screenshot"] = str(path.relative_to(ROOT))
        result["status"] = "captured"
        result["stage"] = "complete"
        driver.execute_script(
            'browserstack_executor: {"action":"setSessionStatus",'
            f'"arguments":{{"status":"passed","reason":"{screen_id} evidence captured"}}}}'
        )
    except (TimeoutException, WebDriverException, OSError, RuntimeError) as error:
        result["error_type"] = type(error).__name__
        result["error"] = sanitize_error(error, username, access_key)
        if driver:
            try:
                result["current_url"] = driver.current_url
                result["page_title"] = driver.title
                result["body_excerpt"] = driver.find_element(
                    By.TAG_NAME, "body"
                ).text[:1500]
                error_path = RAW_DIR / f"{screen_id}_{cell.cell_id}_error.png"
                driver.save_screenshot(str(error_path))
                result["error_screenshot"] = str(error_path.relative_to(ROOT))
            except Exception:
                pass
            try:
                reason = result["error"].replace('"', "'").replace("\n", " ")[:220]
                driver.execute_script(
                    'browserstack_executor: {"action":"setSessionStatus",'
                    f'"arguments":{{"status":"failed","reason":"{reason}"}}}}'
                )
            except Exception:
                pass
    finally:
        if driver:
            try:
                driver.quit()
            except Exception:
                pass
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--inventory",
        action="store_true",
        help="Print relevant BrowserStack browser/device inventory and exit.",
    )
    parser.add_argument(
        "--cells",
        nargs="*",
        help="Optional cell IDs to execute; defaults to all C01-C10.",
    )
    parser.add_argument(
        "--screen",
        choices=("B1", "B2", "B4"),
        default="B1",
        help="Authenticated EMS screen to capture (default: B1).",
    )
    args = parser.parse_args()
    username, access_key = credentials()

    if args.inventory:
        print_relevant_inventory(browser_inventory(username, access_key))
        return 0

    requested = set(args.cells or [cell.cell_id for cell in MATRIX])
    unknown = requested - {cell.cell_id for cell in MATRIX}
    if unknown:
        raise SystemExit(f"Unknown cells: {', '.join(sorted(unknown))}")

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    results_path = (
        ROOT
        / f"artifacts/04-cross-platform/{args.screen}-browserstack-results.json"
    )
    prior_results: dict[str, dict[str, Any]] = {}
    if results_path.exists():
        try:
            prior_results = {
                item["cell"]: item
                for item in json.loads(results_path.read_text(encoding="utf-8"))
            }
        except (json.JSONDecodeError, KeyError, TypeError):
            prior_results = {}
    requested_results = []
    for cell in MATRIX:
        if cell.cell_id not in requested:
            continue
        print(f"[{cell.cell_id}] Starting {cell.target_os} / {cell.browser}")
        result = capture_cell(cell, username, access_key, args.screen)
        prior_results[cell.cell_id] = result
        requested_results.append(result)
        print(f"[{cell.cell_id}] {result['status']}")
        results_path.write_text(
            json.dumps(
                [prior_results[key] for key in sorted(prior_results)],
                indent=2,
                ensure_ascii=False,
            ) + "\n",
            encoding="utf-8",
        )

    captured = sum(item["status"] == "captured" for item in requested_results)
    print(f"Captured {captured}/{len(requested_results)} requested cells.")
    return 0 if captured == len(requested_results) else 2


if __name__ == "__main__":
    sys.exit(main())
