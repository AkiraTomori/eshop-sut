import { type Page } from '@playwright/test';
import { test, expect } from '../fixtures/eshop.fixture';
import { ProductDetailPage } from '../pages/product-detail.page';
import testData from './fr06-test-data.json';

type ProductKey = keyof typeof testData.products;
type FocusTarget = Parameters<ProductDetailPage['focusTarget']>[0];

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

async function addCartPrecondition(
  productPage: ProductDetailPage,
  quantity: string,
): Promise<void> {
  await productPage.setQuantity(quantity);
  await productPage.addToCart();

  if (!(await productPage.feedback(testData.ui.addedFeedback).isVisible())) {
    await productPage.addToCart();
  }

  await expect(productPage.feedback(testData.ui.addedFeedback)).toBeVisible();
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
    const product = testData.products.primary;
    const expectedUrl = new URL(
      `${testData.metadata.productRoutePrefix}${product.id}`,
      testData.metadata.frontendUrl,
    ).toString();

    await expect(page).toHaveURL(expectedUrl);
    await expect(productDetailPage.productImage).toBeVisible();
    await expect(productDetailPage.productImage).toHaveAttribute(
      'alt',
      product.name,
    );
    await expect(productDetailPage.productName).toHaveText(product.name);
    await expect(productDetailPage.productPrice).toHaveText(product.price);
    await expect(productDetailPage.productDescription).toHaveText(
      product.description,
    );
    await expect(productDetailPage.categoryText(product.category)).toBeVisible();
    await expect(
      productDetailPage.breadcrumb(testData.ui.breadcrumbName),
    ).toBeVisible();
    await expect(productDetailPage.pageHeadings).toHaveCount(1);
    await expect(productDetailPage.documentRoot).toHaveAttribute(
      'lang',
      testData.ui.documentLanguage,
    );
    await expect(productDetailPage.addToCartButton).toHaveCSS(
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
    async ({ page, productDetailPage }) => {
      await productDetailPage.setQuantity(
        testData.unauthenticatedCase.quantity,
      );
      await productDetailPage.addToCart();

      const loginUrl = new URL(
        testData.routes.login,
        testData.metadata.frontendUrl,
      ).toString();
      await expect
        .soft
        .poll(async () => {
          return (
            page.url() === loginUrl ||
            (await productDetailPage.validationAlert.isVisible())
          );
        })
        .toBe(true);

      await productDetailPage.openCart(testData.navigationLabels);
      await expect(
        productDetailPage.cartRows(testData.products.primary.name),
      ).toHaveCount(0);
    },
  );

  for (const testCase of testData.boundaryProductCases) {
    test(testTitle(testCase), async ({ page, productDetailPage }) => {
      const product = testData.products[testCase.productKey as ProductKey];
      await productDetailPage.open(product.id);

      await expect(page).toHaveURL(
        new URL(
          `${testData.metadata.productRoutePrefix}${product.id}`,
          testData.metadata.frontendUrl,
        ).toString(),
      );
      await expect(productDetailPage.productImage).toBeVisible();
      await expect(productDetailPage.productName).toHaveText(product.name);
      await expect(productDetailPage.productPrice).toHaveText(product.price);
      await expect(productDetailPage.productDescription).toHaveText(
        product.description,
      );
      await expect(productDetailPage.categoryText(product.category)).toBeVisible();
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
    const productPage = authenticatedProductPage(userPage);
    const testCase = testData.duplicateCartCase;

    await addCartPrecondition(productPage, testCase.existingQuantity);
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
  });

  for (const testCase of testData.invalidQuantityCases) {
    test(testTitle(testCase), async ({ userPage }) => {
      const productPage = authenticatedProductPage(userPage);
      await productPage.setQuantity(testCase.quantity);
      await productPage.addToCart();

      const hasNativeGuard =
        (await productPage.quantityInput.getAttribute(
          testCase.constraint.name,
        )) === testCase.constraint.value;
      const hasVisibleValidation = await productPage.validationAlert.isVisible();
      expect.soft(hasNativeGuard || hasVisibleValidation).toBe(true);

      await productPage.openCart(testData.navigationLabels);
      await expect(
        productPage.cartRows(testData.products.primary.name),
      ).toHaveCount(0);
    });
  }

  test(testTitle(testData.decimalQuantityCase), async ({ userPage }) => {
    const productPage = authenticatedProductPage(userPage);
    const testCase = testData.decimalQuantityCase;
    await productPage.setQuantity(testCase.quantity);
    await productPage.addToCart();

    const hasVisibleValidation = await productPage.validationAlert.isVisible();
    await productPage.openCart(testData.navigationLabels);
    const cartRows = productPage.cartRows(testData.products.primary.name);

    if ((await cartRows.count()) > 0) {
      await expect(cartRows).toHaveCount(1);
      await expect(
        productPage.cartQuantity(
          testData.products.primary.name,
          testCase.safeIntegerQuantity,
        ),
      ).toBeVisible();
    } else {
      expect(hasVisibleValidation).toBe(true);
    }
  });

  test(testTitle(testData.nonNumericQuantityCase), async ({ userPage }) => {
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
    const productPage = authenticatedProductPage(userPage);
    const testCase = testData.largeQuantityCase;
    await productPage.setQuantity(testCase.quantity);
    await productPage.addToCart();

    const hasVisibleValidation = await productPage.validationAlert.isVisible();
    await productPage.openCart(testData.navigationLabels);
    const cartRows = productPage.cartRows(testData.products.primary.name);

    if ((await cartRows.count()) > 0) {
      await expect(
        productPage.cartQuantity(
          testData.products.primary.name,
          testCase.quantity,
        ),
      ).toBeVisible();
      await expect(productPage.cartAmount(testCase.expectedTotal)).toBeVisible();
    } else {
      expect(hasVisibleValidation).toBe(true);
    }
  });

  for (const testCase of testData.validBoundaryQuantityCases) {
    test(testTitle(testCase), async ({ userPage }) => {
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
      await expect(productPage.cartAmount(testCase.expectedTotal)).toBeVisible();
    });
  }

  test(
    testTitle(testData.baselineUpperBoundaryCase),
    async ({ userPage }) => {
      const productPage = authenticatedProductPage(userPage);
      const testCase = testData.baselineUpperBoundaryCase;
      await productPage.setQuantity(testCase.quantity);
      await productPage.addToCart();

      const hasVisibleValidation =
        await productPage.validationAlert.isVisible();
      await productPage.openCart(testData.navigationLabels);
      const cartRows = productPage.cartRows(testData.products.primary.name);

      if ((await cartRows.count()) > 0) {
        await expect(
          productPage.cartQuantity(
            testData.products.primary.name,
            testCase.quantity,
          ),
        ).toBeVisible();
        await expect(
          productPage.cartAmount(testCase.expectedTotal),
        ).toBeVisible();
      } else {
        expect(hasVisibleValidation).toBe(true);
      }
    },
  );
});
