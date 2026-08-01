import { test, expect } from '../fixtures/eshop.fixture';
import {
  ProductManagementPage,
  type ProductFormData,
} from '../pages/product-management.page';
import testData from './fr15-test-data.json';

type ProductInput = ProductFormData & {
  categoryLabel: string;
};

type BoundaryInput = {
  name?: string;
  nameCharacter?: string;
  nameLength?: number;
  price: string;
  description?: string;
  descriptionCharacter?: string;
  descriptionLength?: number;
  imageUrl: string;
  categoryLabel: string;
  expectedPrice: string;
};

type FR15Case = {
  id: string;
  title: string;
  type: string;
  cleanupNames: string[];
  cleanupInputNames?: Array<{ character: string; length: number }>;
  bugIds: string[];
};

const selectedCases = Object.values(testData.cases) as FR15Case[];

function testTitle(testCase: FR15Case): string {
  return `${testCase.id} — ${testCase.title} ${testData.metadata.tag}`;
}

function currentCase(title: string): FR15Case {
  const testCase = selectedCases.find(({ id }) => title.includes(id));
  if (!testCase) {
    throw new Error(`No FR-15 external data found for test title: ${title}`);
  }
  return testCase;
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

async function createProductThroughUi(
  productPage: ProductManagementPage,
  input: ProductInput,
): Promise<void> {
  await expect(productPage.formHeading).toHaveText(
    testData.ui.formHeadingCreate,
  );
  await productPage.fillProduct(input);
  await productPage.selectCategoryByLabel(input.categoryLabel);
  await expect(productPage.nameInput).toHaveValue(input.name);
  await expect(productPage.priceInput).toHaveValue(String(input.price));
  await productPage.saveProduct();
  await expect(productPage.productRow(input.name)).toHaveCount(
    testData.ui.expectedSingleRow,
  );
}

async function fillProductThroughUi(
  productPage: ProductManagementPage,
  input: ProductInput,
): Promise<void> {
  await productPage.fillProduct(input);
  await productPage.selectCategoryByLabel(input.categoryLabel);
}

async function expectDialogMessage(
  messages: string[],
  expectedMessage: string,
): Promise<void> {
  expect.soft(messages).toContain(expectedMessage);
}

async function expectSuccessFeedback(
  productPage: ProductManagementPage,
  messages: string[],
  expectedMessage: string,
): Promise<void> {
  if (messages.includes(expectedMessage)) {
    expect(messages).toContain(expectedMessage);
    return;
  }

  await expect(
    productPage.page.getByText(expectedMessage, { exact: true }),
  ).toBeVisible({ timeout: testData.ui.absentFeatureTimeout });
}

async function expectErrorAboveSaveButton(
  productPage: ProductManagementPage,
  message: string,
): Promise<void> {
  const error = productPage.errorMessage(message);
  await expect.soft(error).toBeVisible({
    timeout: testData.ui.absentFeatureTimeout,
  });

  if ((await error.count()) > 0) {
    await expect
      .poll(() => productPage.isErrorAboveSaveButton(message))
      .toBe(true);
  }
}

async function cleanCurrentCase(
  productPage: ProductManagementPage,
  title: string,
): Promise<void> {
  const testCase = currentCase(title);
  const generatedNames = (testCase.cleanupInputNames ?? []).map(
    ({ character, length }) => character.repeat(length),
  );

  for (const name of [...testCase.cleanupNames, ...generatedNames]) {
    await productPage.deleteAllProductsNamed(name);
  }
}

function resolveBoundaryInput(input: BoundaryInput): ProductInput {
  const name = input.name ?? input.nameCharacter?.repeat(input.nameLength ?? 0);
  if (name === undefined) {
    throw new Error('Boundary input must supply a name or name repetition data');
  }

  return {
    name,
    price: input.price,
    description:
      input.description ??
      input.descriptionCharacter?.repeat(input.descriptionLength ?? 0) ??
      '',
    imageUrl: input.imageUrl,
    categoryLabel: input.categoryLabel,
  };
}

async function expectConfiguredTabOrder(
  productPage: ProductManagementPage,
): Promise<void> {
  const focusTargets = {
    name: productPage.nameInput,
    price: productPage.priceInput,
    description: productPage.descriptionInput,
    imageUrl: productPage.imageUrlInput,
    category: productPage.categorySelect,
    save: productPage.saveButton,
  };

  await focusTargets[testData.ui.tabOrder[0] as keyof typeof focusTargets].focus();
  await expect(
    focusTargets[testData.ui.tabOrder[0] as keyof typeof focusTargets],
  ).toBeFocused();

  for (const targetName of testData.ui.tabOrder.slice(1)) {
    await productPage.page.keyboard.press(testData.ui.keyboardNextKey);
    await expect(
      focusTargets[targetName as keyof typeof focusTargets],
    ).toBeFocused();
  }
}

test.describe('FR-15 Product Management browser UI automation', () => {
  test.beforeEach(async ({ productManagementPage }, testInfo) => {
    await productManagementPage.open();
    await expect(productManagementPage.page).toHaveURL(
      new URL(
        testData.metadata.adminRoute,
        testData.metadata.adminUrl,
      ).toString(),
    );
    await expect(productManagementPage.heading).toBeVisible();
    await cleanCurrentCase(productManagementPage, testInfo.title);
  });

  test.afterEach(async ({ productManagementPage }, testInfo) => {
    await productManagementPage.open();
    await cleanCurrentCase(productManagementPage, testInfo.title);
  });

  test(testTitle(testData.cases.ep001), async ({ productManagementPage }) => {
    const testCase = testData.cases.ep001;
    annotateKnownBugs(testCase.bugIds);
    await fillProductThroughUi(productManagementPage, testCase.input);

    const messages = await productManagementPage.captureDialogsDuring(() =>
      productManagementPage.saveProduct(),
    );
    const row = productManagementPage.productRow(testCase.input.name);

    await expect(row).toBeVisible();
    await expect(row).toContainText(testData.ui.expectedFormattedPrices.full);
    await expect(productManagementPage.productImage(testCase.input.name)).toBeVisible();
    await expect(productManagementPage.productRow(testData.baselineProduct.name)).toBeVisible();
    await expectSuccessFeedback(
      productManagementPage,
      messages,
      testData.ui.successCreateMessage,
    );
    await productManagementPage.editProduct(testCase.input.name);
    await expect(productManagementPage.nameInput).toHaveValue(testCase.input.name);
    await expect(productManagementPage.priceInput).toHaveValue(testCase.input.price);
    await expect(productManagementPage.descriptionInput).toHaveValue(
      testCase.input.description,
    );
    await expect(productManagementPage.imageUrlInput).toHaveValue(
      testCase.input.imageUrl,
    );
  });

  test(testTitle(testData.cases.ep002), async ({ productManagementPage }) => {
    const testCase = testData.cases.ep002;
    annotateKnownBugs(testCase.bugIds);
    await fillProductThroughUi(productManagementPage, testCase.input);

    const messages = await productManagementPage.captureDialogsDuring(() =>
      productManagementPage.saveProduct(),
    );

    await expect(productManagementPage.productRow(testCase.input.name)).toContainText(
      testData.ui.expectedFormattedPrices.mandatoryOnly,
    );
    await expect(productManagementPage.productImage(testCase.input.name)).toBeVisible();
    await expect(productManagementPage.productRow(testData.baselineProduct.name)).toBeVisible();
    await expectSuccessFeedback(
      productManagementPage,
      messages,
      testData.ui.successCreateMessage,
    );
    await productManagementPage.editProduct(testCase.input.name);
    await expect(productManagementPage.descriptionInput).toHaveValue(
      testCase.input.description,
    );
    await expect(productManagementPage.imageUrlInput).toHaveValue(
      testCase.input.imageUrl,
    );
  });

  test(testTitle(testData.cases.ep004), async ({ productManagementPage }) => {
    const testCase = testData.cases.ep004;
    annotateKnownBugs(testCase.bugIds);
    await createProductThroughUi(productManagementPage, testCase.input);

    const messages = await productManagementPage.captureDialogsDuring(
      () => productManagementPage.deleteProduct(testCase.input.name),
      'accept',
    );

    await expectDialogMessage(messages, testData.ui.deleteConfirmationText);
    await expectSuccessFeedback(
      productManagementPage,
      messages,
      testData.ui.successDeleteMessage,
    );
    await expect(productManagementPage.productRow(testCase.input.name)).toHaveCount(
      testData.ui.expectedNoRows,
    );
    await expect(productManagementPage.productRow(testData.baselineProduct.name)).toBeVisible();
  });

  test(testTitle(testData.cases.ep005), async ({ productManagementPage }) => {
    const testCase = testData.cases.ep005;
    annotateKnownBugs(testCase.bugIds);
    await createProductThroughUi(productManagementPage, testCase.input);

    const messages = await productManagementPage.captureDialogsDuring(
      () => productManagementPage.deleteProduct(testCase.input.name),
      'dismiss',
    );

    await expectDialogMessage(messages, testData.ui.deleteConfirmationText);
    await expect.soft(messages).toHaveLength(testData.ui.expectedDialogCount);
    await expect(productManagementPage.productRow(testCase.input.name)).toHaveCount(
      testData.ui.expectedSingleRow,
    );
    await expect(productManagementPage.productRow(testCase.input.name)).toContainText(
      testData.ui.expectedFormattedPrices.cancelledDelete,
    );
    await expect(productManagementPage.productImage(testCase.input.name)).toBeVisible();
    await expect(
      productManagementPage.page.getByText(testData.ui.successDeleteMessage, {
        exact: true,
      }),
    ).not.toBeVisible();
  });

  test(testTitle(testData.cases.ep006), async ({ productManagementPage }) => {
    const testCase = testData.cases.ep006;
    annotateKnownBugs(testCase.bugIds);
    await createProductThroughUi(productManagementPage, testCase.input);
    const row = productManagementPage.productRow(testCase.input.name);

    await expect.soft(productManagementPage.loadingIndicator).toBeVisible({
      timeout: testData.ui.absentFeatureTimeout,
    });
    await expect(row).toBeVisible();
    await expect(row).toContainText(testCase.input.name);
    await expect(row).toContainText(testData.ui.expectedFormattedPrices.list);
    await expect.soft(row).toContainText(testCase.input.categoryLabel);
    await expect(productManagementPage.productImage(testCase.input.name)).toBeVisible();
    await expect(productManagementPage.productRow(testData.baselineProduct.name)).toBeVisible();
    await expect(productManagementPage.primaryHeadings).toHaveCount(
      testData.ui.expectedPrimaryHeadingCount,
    );
    await expect.soft(productManagementPage.primaryHeadings).toHaveText(
      testData.ui.meaningfulPrimaryHeading,
    );
  });

  test(testTitle(testData.cases.ep007), async ({ productManagementPage }) => {
    const testCase = testData.cases.ep007;
    annotateKnownBugs(testCase.bugIds);
    await createProductThroughUi(productManagementPage, testCase.matching);
    await createProductThroughUi(productManagementPage, testCase.nonMatching);

    await expect(productManagementPage.searchInput).toBeVisible({
      timeout: testData.ui.absentFeatureTimeout,
    });
    await productManagementPage.searchInput.fill(testCase.keyword);
    await expect(productManagementPage.searchInput).toHaveValue(testCase.keyword);
    await expect(productManagementPage.productRow(testCase.matching.name)).toBeVisible();
    await expect(productManagementPage.productRow(testCase.nonMatching.name)).not.toBeVisible();
  });

  test(testTitle(testData.cases.ep008), async ({ productManagementPage }) => {
    const testCase = testData.cases.ep008;
    annotateKnownBugs(testCase.bugIds);

    await expect(productManagementPage.searchInput).toBeVisible({
      timeout: testData.ui.absentFeatureTimeout,
    });
    await productManagementPage.searchInput.fill(testCase.keyword);
    await expect(productManagementPage.searchInput).toHaveValue(testCase.keyword);
    await expect(productManagementPage.productTable.getByRole('row')).toHaveCount(
      testData.ui.expectedSingleRow,
    );
    await expect(productManagementPage.page.getByText(testData.ui.emptySearchMessage)).toBeVisible();
  });

  test(testTitle(testData.cases.ep009), async ({ productManagementPage }) => {
    const testCase = testData.cases.ep009;
    annotateKnownBugs(testCase.bugIds);
    await createProductThroughUi(productManagementPage, testCase.input);

    const viewAction = productManagementPage.productViewAction(
      testCase.input.name,
      testData.ui.viewAction,
    );
    await expect(viewAction).toBeVisible({
      timeout: testData.ui.absentFeatureTimeout,
    });
    await viewAction.click();
    await expect(productManagementPage.page.getByText(testCase.input.name)).toBeVisible();
    await expect(
      productManagementPage.page.getByText(testData.ui.expectedFormattedPrices.detail),
    ).toBeVisible();
    await expect(
      productManagementPage.page.getByText(testCase.input.description),
    ).toBeVisible();
    await expect(productManagementPage.page.getByRole('img', { name: testCase.input.name })).toBeVisible();
    await expect(productManagementPage.page.getByText(testCase.input.categoryLabel)).toBeVisible();
  });

  test(testTitle(testData.cases.ep010), async ({ productManagementPage }) => {
    const testCase = testData.cases.ep010;
    annotateKnownBugs(testCase.bugIds);

    for (const label of testData.ui.requiredLabels) {
      await expect.soft(productManagementPage.requiredFieldLabel(label)).toBeVisible({
        timeout: testData.ui.absentFeatureTimeout,
      });
    }
    await expect.soft(productManagementPage.saveButton).toHaveCSS(
      testData.ui.backgroundColourProperty,
      testData.ui.positiveActionColour,
    );
    await expect(
      productManagementPage
        .productRow(testData.baselineProduct.name)
        .getByRole('button', { name: testData.ui.deleteButton }),
    ).toHaveCSS(
      testData.ui.backgroundColourProperty,
      testData.ui.dangerousActionColour,
    );
    await productManagementPage.clearProductForm();
    await productManagementPage.saveProduct();
    await expectErrorAboveSaveButton(
      productManagementPage,
      testData.ui.requiredNameError,
    );
    await expectConfiguredTabOrder(productManagementPage);
  });

  test(testTitle(testData.cases.neg005), async ({ productManagementPage }) => {
    const testCase = testData.cases.neg005;
    annotateKnownBugs(testCase.bugIds);
    const rowsBeforeSubmission = await productManagementPage.productTable
      .getByRole('row')
      .count();
    await fillProductThroughUi(productManagementPage, testCase.input);
    await productManagementPage.saveProduct();

    await expect(productManagementPage.nameInput).toHaveAttribute(
      testData.ui.requiredAttribute,
      '',
    );
    await expect(productManagementPage.nameInput).toHaveValue(testCase.input.name);
    await expectErrorAboveSaveButton(
      productManagementPage,
      testData.ui.requiredNameError,
    );
    await expect(productManagementPage.productTable.getByRole('row')).toHaveCount(
      rowsBeforeSubmission,
    );
  });

  for (const testCase of [testData.cases.neg009, testData.cases.neg010]) {
    test(testTitle(testCase), async ({ productManagementPage }) => {
      annotateKnownBugs(testCase.bugIds);
      await fillProductThroughUi(productManagementPage, testCase.input);
      await productManagementPage.saveProduct();

      await expectErrorAboveSaveButton(
        productManagementPage,
        testData.ui.positivePriceError,
      );
      await expect.soft(productManagementPage.productRow(testCase.input.name)).toHaveCount(
        testData.ui.expectedNoRows,
      );
    });
  }

  test(testTitle(testData.cases.neg024), async ({ productManagementPage }) => {
    const testCase = testData.cases.neg024;
    annotateKnownBugs(testCase.bugIds);

    for (const label of testData.ui.requiredLabels) {
      await expect.soft(productManagementPage.requiredFieldLabel(label)).toBeVisible({
        timeout: testData.ui.absentFeatureTimeout,
      });
    }
  });

  test(testTitle(testData.cases.neg025), async ({ productManagementPage }) => {
    const testCase = testData.cases.neg025;
    annotateKnownBugs(testCase.bugIds);
    await productManagementPage.clearProductForm();
    await productManagementPage.saveProduct();

    await expectErrorAboveSaveButton(
      productManagementPage,
      testData.ui.requiredNameError,
    );
    await expect(productManagementPage.saveButton).toBeVisible();
  });

  test(testTitle(testData.cases.neg026), async ({ productManagementPage }) => {
    const testCase = testData.cases.neg026;
    annotateKnownBugs(testCase.bugIds);

    await expect.soft(productManagementPage.saveButton).toHaveCSS(
      testData.ui.backgroundColourProperty,
      testData.ui.positiveActionColour,
    );
    await expect(
      productManagementPage
        .productRow(testData.baselineProduct.name)
        .getByRole('button', { name: testData.ui.deleteButton }),
    ).toHaveCSS(
      testData.ui.backgroundColourProperty,
      testData.ui.dangerousActionColour,
    );
  });

  test(testTitle(testData.cases.neg027), async ({ productManagementPage }) => {
    const testCase = testData.cases.neg027;
    annotateKnownBugs(testCase.bugIds);

    await expect(productManagementPage.primaryHeadings).toHaveCount(
      testData.ui.expectedPrimaryHeadingCount,
    );
    await expect.soft(productManagementPage.primaryHeadings).toHaveText(
      testData.ui.meaningfulPrimaryHeading,
    );
  });

  test(testTitle(testData.cases.neg028), async ({ productManagementPage }) => {
    const testCase = testData.cases.neg028;
    annotateKnownBugs(testCase.bugIds);
    await expectConfiguredTabOrder(productManagementPage);
  });

  test(testTitle(testData.cases.neg029), async ({ productManagementPage }) => {
    const testCase = testData.cases.neg029;
    annotateKnownBugs(testCase.bugIds);
    await createProductThroughUi(productManagementPage, testCase.input);

    const messages = await productManagementPage.captureDialogsDuring(
      () => productManagementPage.deleteProduct(testCase.input.name),
      'dismiss',
    );

    await expectDialogMessage(messages, testData.ui.deleteConfirmationText);
    await expect(productManagementPage.productRow(testCase.input.name)).toHaveCount(
      testData.ui.expectedSingleRow,
    );
  });

  for (const boundaryCase of [
    testData.cases.bv001,
    testData.cases.bv002,
    testData.cases.bv006,
    testData.cases.bv007,
    testData.cases.bv008,
    testData.cases.bv011,
    testData.cases.bv012,
  ]) {
    test(testTitle(boundaryCase), async ({ productManagementPage }) => {
      annotateKnownBugs(boundaryCase.bugIds);

      for (const rawInput of boundaryCase.inputs) {
        const input = resolveBoundaryInput(rawInput);
        await createProductThroughUi(productManagementPage, input);
        await expect(productManagementPage.productRow(input.name)).toContainText(
          rawInput.expectedPrice,
        );

        if ('verifyDescription' in boundaryCase && boundaryCase.verifyDescription) {
          await productManagementPage.editProduct(input.name);
          await expect(productManagementPage.descriptionInput).toHaveValue(
            input.description ?? '',
          );
          await productManagementPage.cancelEdit();
          await expect(productManagementPage.formHeading).toHaveText(
            testData.ui.formHeadingCreate,
          );
        }
      }
    });
  }
});
