#!/usr/bin/env python3
"""Add the required MSSV email overlay to raw Stage 4 screenshots."""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = ROOT / "artifacts/04-cross-platform/screenshots/raw"
OUT_DIR = ROOT / "artifacts/04-cross-platform/screenshots"
MSSV_EMAIL = "23127379@student.hcmus.edu.vn"


def load_font(size: int):
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


def overlay(path: Path) -> Path:
    image = Image.open(path).convert("RGBA")
    draw = ImageDraw.Draw(image)
    horizontal_padding = max(12, image.width // 80)
    font_size = min(24, max(14, image.width // 20))
    font = load_font(font_size)
    max_text_width = image.width - 2 * horizontal_padding
    while font_size > 11:
        bounds = draw.textbbox((0, 0), MSSV_EMAIL, font=font)
        if bounds[2] - bounds[0] <= max_text_width:
            break
        font_size -= 1
        font = load_font(font_size)

    bounds = draw.textbbox((0, 0), MSSV_EMAIL, font=font)
    text_height = bounds[3] - bounds[1]
    bar_height = max(44, text_height + 20)
    draw.rectangle(
        [(0, image.height - bar_height), (image.width, image.height)],
        fill=(0, 0, 0, 210),
    )
    draw.text(
        (horizontal_padding, image.height - bar_height + (bar_height - text_height) // 2 - bounds[1]),
        MSSV_EMAIL,
        fill=(255, 255, 255, 255),
        font=font,
    )
    output = OUT_DIR / path.name
    image.convert("RGB").save(output, quality=95)
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--screen",
        choices=("B1", "B2", "B4"),
        default="B1",
        help="Screen prefix whose raw screenshots should be overlaid.",
    )
    args = parser.parse_args()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    paths = sorted(RAW_DIR.glob(f"{args.screen}_C??.png"))
    if not paths:
        raise SystemExit(
            f"No {args.screen} raw screenshots found in {RAW_DIR}"
        )
    for path in paths:
        print(f"Overlaid -> {overlay(path).relative_to(ROOT)}")


if __name__ == "__main__":
    main()
