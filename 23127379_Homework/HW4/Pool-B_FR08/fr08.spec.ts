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
  const uiObservableBugIds = new Set(testData.metadata.uiObservableBugIds);
  for (const bugId of bugIds.filter((id) => uiObservableBugIds.has(id))) {
    test.info().annotations.push({
      type: 'known-bug',
      description: bugId,
    });
  }
}

async function openCheckoutWithProfileAddress(
  checkoutPage: CheckoutPage,
  address: string,
): Promise<void> {
  const updateMessage = await checkoutPage.updateProfileShippingAddress(
    testData.routes,
    testData.labels,
    testData.ui.profilePhonePlaceholder,
    testData.ui.profilePhone,
    testData.ui.shippingAddressPlaceholder,
    address,
  );
  expect(updateMessage).toContain(testData.ui.profileUpdateSuccess);
  await checkoutPage.page.reload();
  await expect(
    checkoutPage.profileShippingAddressInput(
      testData.ui.shippingAddressPlaceholder,
    ),
  ).toHaveValue(address);
  await checkoutPage.openCart(testData.labels);
  await expect(
    checkoutPage.cartRows(testData.ui.productName),
  ).toHaveCount(testData.ui.expectedCartRows);
  await expect(
    checkoutPage.cartSummary(
      testData.ui.cartTotalLabel,
      testData.ui.expectedCartTotal,
    ),
  ).toBeVisible();
  await checkoutPage.proceedFromCart(testData.labels);
  await expect(checkoutPage.page).toHaveURL(
    new URL(
      testData.metadata.checkoutRoute,
      testData.metadata.frontendUrl,
    ).toString(),
  );
}

async function resetProfileAndCart(
  checkoutPage: CheckoutPage,
): Promise<void> {
  const updateMessage = await checkoutPage.updateProfileShippingAddress(
    testData.routes,
    testData.labels,
    testData.ui.profilePhonePlaceholder,
    testData.ui.profilePhone,
    testData.ui.shippingAddressPlaceholder,
    testData.ui.profileCleanupAddress,
  );
  expect(updateMessage).toContain(testData.ui.profileUpdateSuccess);
  await checkoutPage.cleanupCart(testData.labels);
}

async function expectSuccessfulCheckout(
  checkoutPage: CheckoutPage,
): Promise<void> {
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
  errorMessage: string,
): Promise<void> {
  await checkoutPage.submitCheckout(testData.labels);
  await expect(checkoutPage.validationError(errorMessage)).toBeVisible();
  await expect
    .poll(() =>
      checkoutPage.isValidationErrorAboveButton(
        errorMessage,
        testData.labels,
      ),
    )
    .toBe(true);
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
  });

  test.afterEach(async ({ userCheckoutPage }) => {
    await resetProfileAndCart(userCheckoutPage);
  });

  test(testTitle(testData.validCheckoutCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.validCheckoutCase.bugIds);
    await openCheckoutWithProfileAddress(
      userCheckoutPage,
      testData.validCheckoutCase.address,
    );

    await expect(userCheckoutPage.checkoutItems).toHaveCount(
      testData.ui.expectedCartRows,
    );
    await expect(
      userCheckoutPage.checkoutItem(testData.ui.checkoutItemText),
    ).toBeVisible();
    await expect
      .soft(userCheckoutPage.allPrimaryHeadings)
      .toHaveCount(testData.ui.expectedPrimaryHeadings);
    await expect(
      userCheckoutPage.totalText(testData.ui.expectedFormattedTotal),
    ).toBeVisible();
    await expect
      .soft(userCheckoutPage.checkoutButton(testData.labels))
      .toHaveCSS('background-color', testData.ui.positiveActionColour);
    await expectSuccessfulCheckout(userCheckoutPage);
  });

  test(testTitle(testData.blankCouponCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.blankCouponCase.bugIds);
    await openCheckoutWithProfileAddress(
      userCheckoutPage,
      testData.blankCouponCase.address,
    );

    await expect(userCheckoutPage.couponInput).toHaveValue(
      testData.blankCouponCase.couponValue,
    );
    await expect(userCheckoutPage.totalInput).toHaveValue(
      testData.ui.expectedTotalInput,
    );
    await expect(userCheckoutPage.totalInput).not.toBeEditable();
    await expect(
      userCheckoutPage.totalText(testData.ui.expectedFormattedTotal),
    ).toBeVisible();
    await expectSuccessfulCheckout(userCheckoutPage);
  });

  test(testTitle(testData.breadcrumbCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.breadcrumbCase.bugIds);
    await openCheckoutWithProfileAddress(
      userCheckoutPage,
      testData.ui.profileCleanupAddress,
    );

    await expect
      .soft(userCheckoutPage.breadcrumb(testData.ui.breadcrumb))
      .toBeVisible();
    await userCheckoutPage.submitCheckout(testData.labels);
    await expect(
      userCheckoutPage.validationError(testData.ui.requiredAddressError),
    ).toBeVisible();
    await expect
      .poll(() =>
        userCheckoutPage.isValidationErrorAboveButton(
          testData.ui.requiredAddressError,
          testData.labels,
        ),
      )
      .toBe(true);
  });

  test(testTitle(testData.emptyAddressCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.emptyAddressCase.bugIds);
    await openCheckoutWithProfileAddress(
      userCheckoutPage,
      testData.emptyAddressCase.address,
    );
    await expectAddressRejected(
      userCheckoutPage,
      testData.ui.requiredAddressError,
    );
  });

  test(
    testTitle(testData.whitespaceAddressCase),
    async ({ userCheckoutPage }) => {
      annotateKnownBugs(testData.whitespaceAddressCase.bugIds);
      await openCheckoutWithProfileAddress(
        userCheckoutPage,
        testData.whitespaceAddressCase.address,
      );
      await expectAddressRejected(
        userCheckoutPage,
        testData.ui.requiredAddressError,
      );
    },
  );

  test(testTitle(testData.headingCase), async ({ userCheckoutPage }) => {
    annotateKnownBugs(testData.headingCase.bugIds);
    await openCheckoutWithProfileAddress(
      userCheckoutPage,
      testData.ui.profileBaselineAddress,
    );

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
    await expect(
      userCheckoutPage.totalText(testData.ui.expectedFormattedTotal),
    ).toBeVisible();
  });

  for (const testCase of testData.validBoundaryCases) {
    test(testTitle(testCase), async ({ userCheckoutPage }) => {
      annotateKnownBugs(testCase.bugIds);
      expect(testCase.address).toHaveLength(testCase.expectedLength);
      await openCheckoutWithProfileAddress(
        userCheckoutPage,
        testCase.address,
      );
      await expectSuccessfulCheckout(userCheckoutPage);
    });
  }

  test(
    testTitle(testData.zeroLengthBoundaryCase),
    async ({ userCheckoutPage }) => {
      annotateKnownBugs(testData.zeroLengthBoundaryCase.bugIds);
      expect(testData.zeroLengthBoundaryCase.address).toHaveLength(
        testData.zeroLengthBoundaryCase.expectedLength,
      );
      await openCheckoutWithProfileAddress(
        userCheckoutPage,
        testData.zeroLengthBoundaryCase.address,
      );
      await expectAddressRejected(
        userCheckoutPage,
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
      await openCheckoutWithProfileAddress(
        userCheckoutPage,
        testData.overLengthBoundaryCase.address,
      );
      await expectAddressRejected(
        userCheckoutPage,
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
      userCheckoutPage.emptyCartIllustration(),
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
  });

  test.afterEach(async ({ checkoutPage }) => {
    await checkoutPage.cleanupCart(testData.labels);
  });

  test(
    testTitle(testData.unauthenticatedCase),
    async ({ page, checkoutPage }) => {
      annotateKnownBugs(testData.unauthenticatedCase.bugIds);
      const dialogPromise = page.waitForEvent('dialog');

      const checkoutPromise = checkoutPage.proceedFromCart(testData.labels);
      const dialog = await dialogPromise;
      expect(dialog.message()).toContain(testData.ui.authenticationError);
      await dialog.dismiss();
      await checkoutPromise;
      await expect(page).toHaveURL(
        new URL(
          testData.routes.login,
          testData.metadata.frontendUrl,
        ).toString(),
      );
    },
  );
});
