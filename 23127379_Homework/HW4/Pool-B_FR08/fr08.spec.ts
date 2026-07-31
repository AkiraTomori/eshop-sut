import { type Page } from '@playwright/test';
import { test, expect } from '../fixtures/eshop.fixture';
import { CheckoutPage } from '../pages/checkout.page';
import testData from './fr08-test-data.json';

type TestCase = {
  id: string;
  title: string;
  bugIds: string[];
};

function testTitle(testCase: TestCase): string {
  return `${testCase.id} — ${testCase.title} ${testData.metadata.tag}`;
}

function annotateKnownBugs(bugIds: string[]): void {
  for (const bugId of bugIds) {
    test.info().annotations.push({
      type: 'known-bug',
      description: bugId,
    });
  }
}

function anonymousCheckoutPage(page: Page): CheckoutPage {
  return new CheckoutPage(
    page,
    testData.metadata.frontendUrl,
    testData.metadata.checkoutRoute,
  );
}

async function expectSuccessfulCheckout(
  checkoutPage: CheckoutPage,
  address: string,
): Promise<void> {
  await expect(
    checkoutPage.shippingAddressInput(testData.ui.shippingAddressLabel),
  ).toBeVisible();
  await checkoutPage.fillShippingAddress(
    testData.ui.shippingAddressLabel,
    address,
  );
  await expect(
    checkoutPage.shippingAddressInput(testData.ui.shippingAddressLabel),
  ).toHaveValue(address);
  await checkoutPage.submitCheckout(testData.labels);
  await expect(
    checkoutPage.successMessage(testData.ui.successMessage),
  ).toBeVisible();
  await checkoutPage.openCart(testData.labels);
  await expect(
    checkoutPage.emptyCartMessage(testData.ui.emptyCartMessage),
  ).toBeVisible();
  await expect(
    checkoutPage.cartRows(testData.ui.productName),
  ).toHaveCount(testData.ui.expectedEmptyCartRows);
}

async function expectAddressRejected(
  checkoutPage: CheckoutPage,
  address: string,
  errorMessage: string,
): Promise<void> {
  await expect(
    checkoutPage.shippingAddressInput(testData.ui.shippingAddressLabel),
  ).toBeVisible();
  await checkoutPage.fillShippingAddress(
    testData.ui.shippingAddressLabel,
    address,
  );
  await checkoutPage.submitCheckout(testData.labels);
  await expect(checkoutPage.validationError(errorMessage)).toBeVisible();
  await expect(
    checkoutPage.validationErrorBeforeButton(errorMessage, testData.labels),
  ).toHaveCount(testData.ui.expectedErrorButtonCount);
  await expect(checkoutPage.page).toHaveURL(
    new URL(
      testData.metadata.checkoutRoute,
      testData.metadata.frontendUrl,
    ).toString(),
  );
  await expect(checkoutPage.checkoutItems).toHaveCount(
    testData.ui.expectedCartRows,
  );
}

test.describe('FR-08 authenticated checkout with a non-empty cart', () => {
  test.beforeEach(async ({ userCheckoutPage }) => {
    await userCheckoutPage.prepareCart(
      testData.routes,
      testData.labels,
      testData.ui.productName,
    );
    await expect(
      userCheckoutPage.cartRows(testData.ui.productName),
    ).toHaveCount(testData.ui.expectedCartRows);
    await userCheckoutPage.proceedFromCart(testData.labels);
  });

  test.afterEach(async ({ userCheckoutPage }) => {
    await userCheckoutPage.cleanupCart(testData.labels);
  });

  test(testTitle(testData.validCheckoutCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.validCheckoutCase.bugIds);
    const expectedUrl = new URL(
      testData.metadata.checkoutRoute,
      testData.metadata.frontendUrl,
    ).toString();
    const formattedTotal = new RegExp(testData.ui.formattedTotalPattern);

    await expect(userCheckoutPage.page).toHaveURL(expectedUrl);
    await expect(userCheckoutPage.checkoutItems).toHaveCount(
      testData.ui.expectedCartRows,
    );
    await expect
      .soft(userCheckoutPage.allPrimaryHeadings)
      .toHaveCount(testData.ui.expectedPrimaryHeadings);
    await expect(userCheckoutPage.totalText(formattedTotal)).toBeVisible();
    await expect
      .soft(userCheckoutPage.checkoutButton(testData.labels))
      .toHaveCSS('background-color', testData.ui.positiveActionColour);
    await expectSuccessfulCheckout(
      userCheckoutPage,
      testData.validCheckoutCase.address,
    );
  });

  test(testTitle(testData.blankCouponCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.blankCouponCase.bugIds);
    const totalBeforeCheckout = await userCheckoutPage.totalInput.inputValue();

    await expect(userCheckoutPage.couponInput).toHaveValue(
      testData.blankCouponCase.couponValue,
    );
    await expect(userCheckoutPage.totalInput).toHaveValue(totalBeforeCheckout);
    await expectSuccessfulCheckout(
      userCheckoutPage,
      testData.blankCouponCase.address,
    );
  });

  test(testTitle(testData.breadcrumbCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.breadcrumbCase.bugIds);

    await expect
      .soft(userCheckoutPage.breadcrumb(testData.ui.breadcrumb))
      .toBeVisible();
    await expect
      .soft(
        userCheckoutPage.shippingAddressInput(
          testData.ui.shippingAddressLabel,
        ),
      )
      .toBeVisible();
    await userCheckoutPage.submitCheckout(testData.labels);
    await expect(
      userCheckoutPage.validationError(testData.ui.requiredAddressError),
    ).toBeVisible();
    await expect(
      userCheckoutPage.validationErrorBeforeButton(
        testData.ui.requiredAddressError,
        testData.labels,
      ),
    ).toHaveCount(testData.ui.expectedErrorButtonCount);
  });

  test(testTitle(testData.emptyAddressCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.emptyAddressCase.bugIds);
    await expectAddressRejected(
      userCheckoutPage,
      testData.emptyAddressCase.address,
      testData.ui.requiredAddressError,
    );
  });

  test(
    testTitle(testData.whitespaceAddressCase),
    async ({ userCheckoutPage }) => {
      annotateKnownBugs(testData.whitespaceAddressCase.bugIds);
      await expectAddressRejected(
        userCheckoutPage,
        testData.whitespaceAddressCase.address,
        testData.ui.requiredAddressError,
      );
    },
  );

  test(testTitle(testData.headingCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.headingCase.bugIds);
    const formattedTotal = new RegExp(testData.ui.formattedTotalPattern);

    await expect(userCheckoutPage.allPrimaryHeadings).toHaveCount(
      testData.ui.expectedPrimaryHeadings,
    );
    await expect(userCheckoutPage.primaryHeading).toHaveText(
      testData.ui.checkoutHeading,
    );
    await expect(userCheckoutPage.checkoutButton(testData.labels)).toHaveCSS(
      'background-color',
      testData.ui.positiveActionColour,
    );
    await expect(userCheckoutPage.totalText(formattedTotal)).toBeVisible();
  });

  for (const testCase of testData.validBoundaryCases) {
    test(testTitle(testCase), async ({ userCheckoutPage }) => {
      annotateKnownBugs(testCase.bugIds);
      expect(testCase.address).toHaveLength(testCase.expectedLength);
      await expectSuccessfulCheckout(userCheckoutPage, testCase.address);
    });
  }

  test(
    testTitle(testData.zeroLengthBoundaryCase),
    async ({ userCheckoutPage }) => {
      annotateKnownBugs(testData.zeroLengthBoundaryCase.bugIds);
      expect(testData.zeroLengthBoundaryCase.address).toHaveLength(
        testData.zeroLengthBoundaryCase.expectedLength,
      );
      await expectAddressRejected(
        userCheckoutPage,
        testData.zeroLengthBoundaryCase.address,
        testData.ui.requiredAddressError,
      );
    },
  );

  test(
    testTitle(testData.overLengthBoundaryCase),
    async ({ userCheckoutPage }) => {
      annotateKnownBugs(testData.overLengthBoundaryCase.bugIds);
      expect(testData.overLengthBoundaryCase.address).toHaveLength(
        testData.overLengthBoundaryCase.expectedLength,
      );
      await expectAddressRejected(
        userCheckoutPage,
        testData.overLengthBoundaryCase.address,
        testData.ui.addressTooLongError,
      );
    },
  );
});

test.describe('FR-08 authenticated empty-cart protection', () => {
  test.beforeEach(async ({ userCheckoutPage }) => {
    await userCheckoutPage.openRoute(testData.routes.cart);
  });

  test.afterEach(async ({ userCheckoutPage }) => {
    await userCheckoutPage.cleanupCart(testData.labels);
  });

  test(testTitle(testData.emptyCartCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.emptyCartCase.bugIds);

    await expect(
      userCheckoutPage.emptyCartMessage(testData.ui.emptyCartMessage),
    ).toBeVisible();
    await expect(
      userCheckoutPage.emptyCartIllustration(testData.ui.emptyCartMessage),
    ).toBeVisible();
    await userCheckoutPage.open();
    await expect(
      userCheckoutPage.emptyCartMessage(testData.ui.emptyCartMessage),
    ).toBeVisible();
    await expect(
      userCheckoutPage.checkoutButton(testData.labels),
    ).not.toBeVisible();
  });
});

test.describe('FR-08 unauthenticated checkout protection', () => {
  test.beforeEach(async ({ checkoutPage }) => {
    await checkoutPage.prepareCart(
      testData.routes,
      testData.labels,
      testData.ui.productName,
    );
    await checkoutPage.open();
  });

  test.afterEach(async ({ checkoutPage }) => {
    await checkoutPage.cleanupCart(testData.labels);
  });

  test(testTitle(testData.unauthenticatedCase), async ({ page }) => {
    annotateKnownBugs(testData.unauthenticatedCase.bugIds);
    const checkoutPage = anonymousCheckoutPage(page);
    const dialogPromise = page.waitForEvent('dialog');

    await checkoutPage.submitCheckout(testData.labels);
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain(testData.ui.authenticationError);
    await dialog.dismiss();
    await expect(page).toHaveURL(
      new URL(
        testData.metadata.checkoutRoute,
        testData.metadata.frontendUrl,
      ).toString(),
    );
  });
});
