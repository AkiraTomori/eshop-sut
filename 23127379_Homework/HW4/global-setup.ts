import { chromium, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import environment from './test-environment.json';

async function loginUser(page: Page): Promise<void> {
  await page.goto(`${environment.urls.frontend}${environment.routes.userLogin}`);
  const loginForm = page.locator('form');

  await loginForm.locator('input').nth(0).fill(environment.accounts.user.email);
  await loginForm
    .locator('input')
    .nth(1)
    .fill(environment.accounts.user.password);
  await loginForm
    .getByRole('button', { name: environment.labels.userLoginButton })
    .click();

  await expect(page).toHaveURL(`${environment.urls.frontend}/`);
}

async function loginAdmin(page: Page): Promise<void> {
  await page.goto(environment.urls.admin);
  await page
    .getByPlaceholder(environment.labels.adminEmailPlaceholder)
    .fill(environment.accounts.admin.email);
  await page
    .getByPlaceholder(environment.labels.adminPasswordPlaceholder)
    .fill(environment.accounts.admin.password);
  await page
    .getByRole('button', { name: environment.labels.adminLoginButton })
    .click();

  await expect(
    page.getByText(environment.labels.adminDashboard, { exact: true }).first(),
  ).toBeVisible();
}

async function globalSetup(): Promise<void> {
  const userStatePath = path.resolve(__dirname, environment.auth.userState);
  const adminStatePath = path.resolve(__dirname, environment.auth.adminState);

  fs.mkdirSync(path.dirname(userStatePath), { recursive: true });
  fs.mkdirSync(path.dirname(adminStatePath), { recursive: true });

  const browser = await chromium.launch();

  try {
    const userContext = await browser.newContext();
    try {
      const userPage = await userContext.newPage();
      await loginUser(userPage);
      await userContext.storageState({ path: userStatePath });
    } finally {
      await userContext.close();
    }

    const adminContext = await browser.newContext();
    try {
      const adminPage = await adminContext.newPage();
      await loginAdmin(adminPage);
      await adminContext.storageState({ path: adminStatePath });
    } finally {
      await adminContext.close();
    }
  } finally {
    await browser.close();
  }
}

export default globalSetup;
