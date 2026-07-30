import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import environment from './test-environment.json';

/**
 * Global Setup — HW04 EShop Automation
 *
 * Logs in as regular user and admin once, saves auth state to file.
 * Authenticated describe blocks load the appropriate storageState explicitly.
 */
async function globalSetup() {
  const userStatePath = path.resolve(__dirname, environment.auth.userState);
  const adminStatePath = path.resolve(__dirname, environment.auth.adminState);
  const authDir = path.dirname(userStatePath);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();

  // --- Regular User Auth ---
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();

  await userPage.goto(`${environment.urls.frontend}/login`);
  const userInputs = userPage.locator('form input');
  await userInputs.first().fill(environment.accounts.user.email);
  await userInputs.last().fill(environment.accounts.user.password);
  await userPage.getByRole('button', { name: 'Sign In' }).click();
  await userPage.waitForURL(`${environment.urls.frontend}/`, {
    timeout: 15_000,
  });
  await userContext.storageState({ path: userStatePath });
  await userContext.close();

  // --- Admin Auth ---
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();

  await adminPage.goto(environment.urls.admin);
  await adminPage
    .getByPlaceholder('Email')
    .fill(environment.accounts.admin.email);
  await adminPage
    .getByPlaceholder('Password')
    .fill(environment.accounts.admin.password);
  await adminPage.getByRole('button', { name: 'Login' }).click();
  await adminPage.getByText('Dashboard', { exact: true }).waitFor({
    state: 'visible',
  });
  await adminContext.storageState({ path: adminStatePath });
  await adminContext.close();

  await browser.close();

  console.log('✅ Global setup complete. Auth states saved for user and admin.');
}

export default globalSetup;
