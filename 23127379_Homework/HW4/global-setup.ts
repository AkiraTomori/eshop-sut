import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global Setup — HW04 EShop Automation
 *
 * Logs in as regular user and admin once, saves auth state to file.
 * Tests reuse these auth states via storageState in playwright.config.ts.
 * This avoids repeated login UI interactions across test runs.
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const adminURL = 'http://localhost:5174';

  // Ensure auth directory exists
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();

  // --- Regular User Auth ---
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();

  await userPage.goto(`${baseURL}/login`);
  await userPage.fill('input[type="email"]', 'test@eshop.com');
  await userPage.fill('input[type="password"]', 'Test1234!');
  await userPage.click('button[type="submit"]');
  await userPage.waitForURL(`${baseURL}/`, { timeout: 15_000 });
  await userContext.storageState({ path: path.join(authDir, 'user.json') });
  await userContext.close();

  // --- Admin Auth ---
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();

  await adminPage.goto(`${adminURL}/login`);
  await adminPage.fill('input[type="email"]', 'admin@eshop.com');
  await adminPage.fill('input[type="password"]', 'Admin123!');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForURL(`${adminURL}/`, { timeout: 15_000 });
  await adminContext.storageState({ path: path.join(authDir, 'admin.json') });
  await adminContext.close();

  await browser.close();

  console.log('✅ Global setup complete. Auth states saved for user and admin.');
}

export default globalSetup;
