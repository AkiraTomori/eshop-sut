import {
  expect,
  test as base,
  type Browser,
  type BrowserContext,
  type Page,
} from '@playwright/test';
import * as path from 'node:path';
import environment from '../test-environment.json';
import { CheckoutPage } from '../pages/checkout.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { ProductManagementPage } from '../pages/product-management.page';

/**
 * Custom fixture types for the EShop HW04 browser-UI test suite.
 *
 * Fixtures share setup/teardown logic across tests. Every fixture uses test
 * scope so each test receives fresh state with no shared mutable resources.
 *
 * Current fixtures:
 * userPage             → Fresh Page loaded with the standard-user auth state
 * adminPage            → Fresh Page loaded with the admin auth state
 * productDetailPage    → FR-06 page object on the default isolated Page
 * checkoutPage         → FR-08 page object on the default isolated Page
 * userCheckoutPage     → FR-08 page object backed by userPage
 * productManagementPage → FR-15 page object backed by adminPage
 *
 * Deliberately excluded by the HW04 browser-UI-only scope:
 * userApiRequest, adminApiRequest, and all direct API/database fixtures.
 *
 * Add resource fixtures such as seededProduct or seededOrder only when their
 * setup and teardown are both implemented through verified UI flows. Define
 * the type in EShopFixtures, implement it in test.extend(), keep one lifecycle
 * per fixture, and always place teardown after await use(...).
 */
type EShopFixtures = {
  userPage: Page;
  adminPage: Page;
  productDetailPage: ProductDetailPage;
  checkoutPage: CheckoutPage;
  userCheckoutPage: CheckoutPage;
  productManagementPage: ProductManagementPage;
};

async function useAuthenticatedPage(
  browser: Browser,
  statePath: string,
  use: (page: Page) => Promise<void>,
): Promise<void> {
  let context: BrowserContext | undefined;

  try {
    context = await browser.newContext({
      storageState: path.resolve(__dirname, '..', statePath),
    });
    await use(await context.newPage());
  } finally {
    await context?.close();
  }
}

export const test = base.extend<EShopFixtures>({
  userPage: async ({ browser }, use) => {
    await useAuthenticatedPage(browser, environment.auth.userState, use);
  },

  adminPage: async ({ browser }, use) => {
    await useAuthenticatedPage(browser, environment.auth.adminState, use);
  },

  productDetailPage: async ({ page }, use) => {
    await use(
      new ProductDetailPage(
        page,
        environment.urls.frontend,
        environment.routes.productDetailPrefix,
      ),
    );
  },

  checkoutPage: async ({ page }, use) => {
    await use(
      new CheckoutPage(
        page,
        environment.urls.frontend,
        environment.routes.checkout,
      ),
    );
  },

  userCheckoutPage: async ({ userPage }, use) => {
    await use(
      new CheckoutPage(
        userPage,
        environment.urls.frontend,
        environment.routes.checkout,
      ),
    );
  },

  productManagementPage: async ({ adminPage }, use) => {
    await use(
      new ProductManagementPage(
        adminPage,
        environment.urls.admin,
        environment.routes.adminRoot,
      ),
    );
  },
});

export { expect };
