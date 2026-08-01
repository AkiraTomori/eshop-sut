import { type Dialog, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export type ProductFormData = {
  name: string;
  price: string | number;
  imageUrl?: string;
  description?: string;
  categoryId?: string | number;
};

export class ProductManagementPage extends BasePage {
  readonly productsNavigation: Locator;
  readonly heading: Locator;
  readonly primaryHeadings: Locator;
  readonly productForm: Locator;
  readonly formHeading: Locator;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly imageUrlInput: Locator;
  readonly descriptionInput: Locator;
  readonly categorySelect: Locator;
  readonly saveButton: Locator;
  readonly cancelEditButton: Locator;
  readonly productTable: Locator;
  readonly searchInput: Locator;
  readonly loadingIndicator: Locator;
  readonly validationErrors: Locator;

  constructor(
    page: Page,
    baseUrl: string,
    private readonly adminRootRoute: string,
  ) {
    super(page, baseUrl);
    this.productsNavigation = page.getByText('Sản phẩm', { exact: true });
    this.heading = page.getByRole('heading', { name: 'Quản lý Sản phẩm' });
    this.primaryHeadings = page.locator('h1');
    this.productForm = page.locator('form').filter({
      has: page.getByRole('heading', { name: /Thêm sản phẩm mới|Sửa sản phẩm/ }),
    });
    this.formHeading = this.productForm.getByRole('heading', {
      name: /Thêm sản phẩm mới|Sửa sản phẩm/,
    });
    this.nameInput = this.productForm.getByPlaceholder('Tên sản phẩm');
    this.priceInput = this.productForm.getByPlaceholder('Giá tiền');
    this.imageUrlInput = this.productForm.getByPlaceholder('URL Ảnh');
    this.descriptionInput = this.productForm.getByPlaceholder('Mô tả');
    this.categorySelect = this.productForm.locator('select');
    this.saveButton = this.productForm.getByRole('button', {
      name: 'Lưu sản phẩm',
    });
    this.cancelEditButton = this.productForm.getByRole('button', {
      name: 'Hủy sửa',
    });
    this.productTable = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Tên SP' }),
    });
    this.searchInput = page.getByRole('searchbox', { name: /sản phẩm/i });
    this.loadingIndicator = page.getByRole('progressbar');
    this.validationErrors = this.productForm.getByRole('alert');
  }

  async open(): Promise<void> {
    await this.navigate(this.adminRootRoute);
    await this.productsNavigation.click();
  }

  async fillProduct(data: ProductFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.priceInput.fill(String(data.price));

    if (data.imageUrl !== undefined) {
      await this.imageUrlInput.fill(data.imageUrl);
    }
    if (data.description !== undefined) {
      await this.descriptionInput.fill(data.description);
    }
    if (data.categoryId !== undefined) {
      await this.categorySelect.selectOption(String(data.categoryId));
    }
  }

  async clearProductForm(): Promise<void> {
    await this.nameInput.clear();
    await this.priceInput.clear();
    await this.imageUrlInput.clear();
    await this.descriptionInput.clear();
  }

  async selectCategoryByLabel(label: string): Promise<void> {
    await this.categorySelect.selectOption({ label });
  }

  async saveProduct(): Promise<void> {
    await this.saveButton.click();
  }

  productRow(name: string): Locator {
    return this.productTable.getByRole('row').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  productNameCell(name: string): Locator {
    return this.productRow(name).getByRole('cell', { name, exact: true });
  }

  productImage(name: string): Locator {
    return this.productRow(name).getByRole('img', { name });
  }

  requiredFieldLabel(label: string): Locator {
    return this.productForm.getByText(label, { exact: true });
  }

  errorMessage(message: string): Locator {
    return this.productForm.getByText(message, { exact: true });
  }

  async isErrorAboveSaveButton(message: string): Promise<boolean> {
    const errorBox = await this.errorMessage(message).boundingBox();
    const buttonBox = await this.saveButton.boundingBox();
    return Boolean(
      errorBox &&
        buttonBox &&
        errorBox.y + errorBox.height <= buttonBox.y,
    );
  }

  productViewAction(name: string, accessibleName: string): Locator {
    const row = this.productRow(name);
    return row
      .getByRole('link', { name: accessibleName })
      .or(row.getByRole('button', { name: accessibleName }));
  }

  async editProduct(name: string): Promise<void> {
    await this.productRow(name).getByRole('button', { name: 'Sửa' }).click();
  }

  async deleteProduct(name: string): Promise<void> {
    await this.productRow(name).getByRole('button', { name: 'Xóa' }).click();
  }

  async captureDialogsDuring(
    action: () => Promise<void>,
    decision: 'accept' | 'dismiss' = 'accept',
  ): Promise<string[]> {
    const messages: string[] = [];
    const handler = async (dialog: Dialog): Promise<void> => {
      messages.push(dialog.message());
      if (decision === 'accept') {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    };

    this.page.on('dialog', handler);
    try {
      await action();
    } finally {
      this.page.off('dialog', handler);
    }

    return messages;
  }

  async deleteAllProductsNamed(name: string): Promise<void> {
    const rows = this.productRow(name);
    const initialCount = await rows.count();

    for (let index = 0; index < initialCount; index += 1) {
      const firstRow = rows.first();
      const handler = async (dialog: Dialog): Promise<void> => {
        await dialog.accept();
      };

      this.page.on('dialog', handler);
      try {
        await firstRow.getByRole('button', { name: 'Xóa' }).click();
        await firstRow.waitFor({ state: 'detached' });
      } finally {
        this.page.off('dialog', handler);
      }
    }
  }
}
