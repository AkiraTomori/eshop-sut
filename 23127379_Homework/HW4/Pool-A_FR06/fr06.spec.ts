import { type Page } from '@playwright/test';
import { test, expect } from '../fixtures/eshop.fixture';
import { ProductDetailPage } from '../pages/product-detail.page';
import testData from './fr06-test-data.json';

type ProductKey = keyof typeof testData.products;
type FocusTarget = Parameters<ProductDetailPage['focusTarget']>[0];
type QuantityConstraint = Parameters<
  ProductDetailPage['quantityInputWithConstraint']
>[0];

function testTitle(testCase: { id: string; title: string }): string {
  return `${testCase.id} — ${testCase.title} ${testData.metadata.tag}`;
}

function authenticatedProductPage(page: Page): ProductDetailPage {
  return new ProductDetailPage(
    page,
    testData.metadata.frontendUrl,
    testData.metadata.productRoutePrefix,
  );
}

function annotateKnownBug(bugId: string | null): void {
  if (bugId) {
    test.info().annotations.push({
      type: 'known-bug',
      description: bugId,
    });
  }
}

test.describe('FR-06 public product-detail UI', () => {
  test.beforeEach(async ({ productDetailPage }) => {
    await productDetailPage.open(testData.products.primary.id);
  });

  test.afterEach(async ({ productDetailPage }) => {
    await productDetailPage.cleanupCart(
      testData.navigationLabels,
      testData.ui.removeButton,
    );
  });

  test(testTitle(testData.displayCase), async ({ page, productDetailPage }) => {
    annotateKnownBug(testData.displayCase.bugId);
    const product = testData.products.primary;
    const productImage = productDetailPage.productImage(product.name);
    const expectedUrl = new URL(
      `${testData.metadata.productRoutePrefix}${product.id}`,
      testData.metadata.frontendUrl,
    ).toString();

    await expect(page).toHaveURL(expectedUrl);
    await expect(productImage).toBeVisible();
    await expect(productImage).toHaveAttribute('alt', product.name);
    await expect(productDetailPage.productName).toHaveText(product.name);
    await expect(productDetailPage.productText(product.price)).toBeVisible();
    await expect(
      productDetailPage.productText(product.description),
    ).toBeVisible();
    await expect
      .soft(productDetailPage.categoryText(product.category))
      .toBeVisible();
    await expect.soft(
      productDetailPage.breadcrumb(testData.ui.breadcrumbName),
    ).toBeVisible();
    await expect(productDetailPage.pageHeadings).toHaveCount(1);
    await expect(
      productDetailPage.quantityLabel(testData.ui.quantityLabel),
    ).toBeVisible();
    await expect(productDetailPage.addToCartButton).toHaveText(
      testData.ui.addToCart,
    );
    await expect.soft(productDetailPage.addToCartButton).toHaveCSS(
      'background-color',
      testData.ui.positiveActionColour,
    );

    for (const target of testData.ui.focusOrder) {
      await page.keyboard.press('Tab');
      await expect(
        productDetailPage.focusTarget(
          target as FocusTarget,
          testData.navigationLabels,
        ),
      ).toBeFocused();
    }
  });

  test(
    testTitle(testData.quantityEntryCase),
    async ({ productDetailPage }) => {
      annotateKnownBug(testData.quantityEntryCase.bugId);
      await expect(productDetailPage.quantityInput).toHaveValue(
        testData.quantityEntryCase.defaultQuantity,
      );
      await productDetailPage.setQuantity(
        testData.quantityEntryCase.enteredQuantity,
      );
      await expect(productDetailPage.quantityInput).toHaveValue(
        testData.quantityEntryCase.enteredQuantity,
      );
    },
  );

  for (const testCase of testData.invalidProductCases) {
    test(testTitle(testCase), async ({ page, productDetailPage }) => {
      annotateKnownBug(testCase.bugId);
      await productDetailPage.open(testCase.productId);

      await expect(page).toHaveURL(
        new URL(
          `${testData.metadata.productRoutePrefix}${testCase.productId}`,
          testData.metadata.frontendUrl,
        ).toString(),
      );
      await expect(
        productDetailPage.productNotFoundMessage(
          testData.ui.productNotFound,
        ),
      ).toBeVisible();
      await expect(productDetailPage.productName).toHaveCount(0);
    });
  }

  test(
    testTitle(testData.unauthenticatedCase),
    async ({ productDetailPage }) => {
      annotateKnownBug(testData.unauthenticatedCase.bugId);
      await productDetailPage.setQuantity(
        testData.unauthenticatedCase.quantity,
      );
      await productDetailPage.addToCart();

      await expect(
        productDetailPage.validationAlert.or(
          productDetailPage.loginButton(testData.ui.loginButton),
        ),
      ).toBeVisible();

      await productDetailPage.openCart(testData.navigationLabels);
      await expect(
        productDetailPage.cartRows(testData.products.primary.name),
      ).toHaveCount(0);
    },
  );

  for (const testCase of testData.boundaryProductCases) {
    test(testTitle(testCase), async ({ page, productDetailPage }) => {
      annotateKnownBug(testCase.bugId);
      const product = testData.products[testCase.productKey as ProductKey];
      const productImage = productDetailPage.productImage(product.name);
      await productDetailPage.open(product.id);

      await expect(page).toHaveURL(
        new URL(
          `${testData.metadata.productRoutePrefix}${product.id}`,
          testData.metadata.frontendUrl,
        ).toString(),
      );
      await expect(productImage).toBeVisible();
      await expect(productImage).toHaveAttribute('alt', product.name);
      await expect(productDetailPage.productName).toHaveText(product.name);
      await expect(productDetailPage.productText(product.price)).toBeVisible();
      await expect(
        productDetailPage.productText(product.description),
      ).toBeVisible();
      await expect(
        productDetailPage.categoryText(product.category),
      ).toBeVisible();
    });
  }
});

test.describe('FR-06 authenticated product-detail UI', () => {
  test.beforeEach(async ({ userPage }) => {
    await authenticatedProductPage(userPage).open(
      testData.products.primary.id,
    );
  });

  test.afterEach(async ({ userPage }) => {
    await authenticatedProductPage(userPage).cleanupCart(
      testData.navigationLabels,
      testData.ui.removeButton,
    );
  });

  test(testTitle(testData.authenticatedAddCase), async ({ userPage }) => {
    annotateKnownBug(testData.authenticatedAddCase.bugId);
    const productPage = authenticatedProductPage(userPage);
    await productPage.setQuantity(testData.authenticatedAddCase.quantity);
    await productPage.addToCart();

    await expect(
      productPage.feedback(testData.ui.addedFeedback),
    ).toBeVisible();
    await expect(
      productPage.cartBadge(
        testData.navigationLabels,
        testData.authenticatedAddCase.quantity,
      ),
    ).toHaveText(testData.authenticatedAddCase.quantity);
  });

  test(testTitle(testData.duplicateCartCase), async ({ userPage }) => {
    annotateKnownBug(testData.duplicateCartCase.bugId);
    const productPage = authenticatedProductPage(userPage);
    const testCase = testData.duplicateCartCase;

    await productPage.setQuantity(testCase.existingQuantity);
    await productPage.addToCart();
    await expect(
      productPage.feedback(testData.ui.addedFeedback),
    ).toBeVisible();
    await productPage.openCart(testData.navigationLabels);
    await expect(
      productPage.cartQuantity(
        testData.products.primary.name,
        testCase.existingQuantity,
      ),
    ).toBeVisible();

    await productPage.open(testData.products.primary.id);
    await productPage.setQuantity(testCase.addedQuantity);
    await productPage.addToCart();
    await productPage.openCart(testData.navigationLabels);

    await expect(
      productPage.cartRows(testData.products.primary.name),
    ).toHaveCount(testCase.expectedRows);
    await expect(
      productPage.cartQuantity(
        testData.products.primary.name,
        testCase.expectedQuantity,
      ),
    ).toBeVisible();
    await expect(
      productPage.cartSummary(
        testData.ui.cartTotalLabel,
        testCase.expectedTotal,
      ),
    ).toBeVisible();
  });

  for (const testCase of testData.invalidQuantityCases) {
    test(testTitle(testCase), async ({ userPage }) => {
      annotateKnownBug(testCase.bugId);
      const productPage = authenticatedProductPage(userPage);
      await productPage.setQuantity(testCase.quantity);
      await productPage.addToCart();

      await expect(
        productPage
          .quantityInputWithConstraint(
            testCase.constraint as QuantityConstraint,
          )
          .or(productPage.validationAlert),
      ).toBeVisible();

      await productPage.openCart(testData.navigationLabels);
      await expect(
        productPage.cartRows(testData.products.primary.name),
      ).toHaveCount(0);
    });
  }

  test(testTitle(testData.decimalQuantityCase), async ({ userPage }) => {
    annotateKnownBug(testData.decimalQuantityCase.bugId);
    const productPage = authenticatedProductPage(userPage);
    const testCase = testData.decimalQuantityCase;
    await productPage.setQuantity(testCase.quantity);
    await productPage.addToCart();

    await expect(
      productPage.validationAlert.or(
        productPage.feedback(testData.ui.addedFeedback),
      ),
    ).toBeVisible();
    await productPage.openCart(testData.navigationLabels);
    await expect(
      productPage
        .cartRowWithQuantityAndSubtotal(
          testData.products.primary.name,
          testCase.safeIntegerQuantity,
          testData.products.primary.price,
        )
        .or(productPage.emptyCartMessage(testData.ui.emptyCart)),
    ).toBeVisible();
  });

  test(testTitle(testData.nonNumericQuantityCase), async ({ userPage }) => {
    annotateKnownBug(testData.nonNumericQuantityCase.bugId);
    const productPage = authenticatedProductPage(userPage);
    const testCase = testData.nonNumericQuantityCase;
    await productPage.typeQuantity(testCase.quantity);

    await expect(productPage.quantityInput).toHaveValue(
      testCase.browserPreventedValue,
    );
    await productPage.addToCart();
    await productPage.openCart(testData.navigationLabels);
    await expect(
      productPage.cartRows(testData.products.primary.name),
    ).toHaveCount(0);
  });

  test(testTitle(testData.largeQuantityCase), async ({ userPage }) => {
    annotateKnownBug(testData.largeQuantityCase.bugId);
    const productPage = authenticatedProductPage(userPage);
    const testCase = testData.largeQuantityCase;
    await productPage.setQuantity(testCase.quantity);
    await productPage.addToCart();

    await expect(
      productPage.validationAlert.or(
        productPage.feedback(testData.ui.addedFeedback),
      ),
    ).toBeVisible();
    await productPage.openCart(testData.navigationLabels);
    await expect(
      productPage
        .cartRowWithQuantityAndSubtotal(
          testData.products.primary.name,
          testCase.quantity,
          testCase.expectedTotal,
        )
        .or(productPage.emptyCartMessage(testData.ui.emptyCart)),
    ).toBeVisible();
  });

  for (const testCase of testData.validBoundaryQuantityCases) {
    test(testTitle(testCase), async ({ userPage }) => {
      annotateKnownBug(testCase.bugId);
      const productPage = authenticatedProductPage(userPage);
      await productPage.setQuantity(testCase.quantity);
      await productPage.addToCart();

      await expect(
        productPage.feedback(testData.ui.addedFeedback),
      ).toBeVisible();
      await productPage.openCart(testData.navigationLabels);
      await expect(
        productPage.cartQuantity(
          testData.products.primary.name,
          testCase.quantity,
        ),
      ).toBeVisible();
      await expect(
        productPage.cartSummary(
          testData.ui.cartTotalLabel,
          testCase.expectedTotal,
        ),
      ).toBeVisible();
    });
  }

  test(
    testTitle(testData.baselineUpperBoundaryCase),
    async ({ userPage }) => {
      annotateKnownBug(testData.baselineUpperBoundaryCase.bugId);
      const productPage = authenticatedProductPage(userPage);
      const testCase = testData.baselineUpperBoundaryCase;
      await productPage.setQuantity(testCase.quantity);
      await productPage.addToCart();

      await expect(
        productPage.validationAlert.or(
          productPage.feedback(testData.ui.addedFeedback),
        ),
      ).toBeVisible();
      await productPage.openCart(testData.navigationLabels);
      await expect(
        productPage
          .cartRowWithQuantityAndSubtotal(
            testData.products.primary.name,
            testCase.quantity,
            testCase.expectedTotal,
          )
          .or(productPage.emptyCartMessage(testData.ui.emptyCart)),
      ).toBeVisible();
    },
  );
});
