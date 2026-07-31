import { type Locator, type Page } from '@playwright/test';
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
  readonly productForm: Locator;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly imageUrlInput: Locator;
  readonly descriptionInput: Locator;
  readonly categorySelect: Locator;
  readonly saveButton: Locator;
  readonly productTable: Locator;

  constructor(
    page: Page,
    baseUrl: string,
    private readonly adminRootRoute: string,
  ) {
    super(page, baseUrl);
    this.productsNavigation = page.getByText('Sản phẩm', { exact: true }).first();
    this.heading = page.getByRole('heading', { name: 'Quản lý Sản phẩm' });
    this.productForm = page.locator('form').filter({
      has: page.getByRole('heading', { name: /Thêm sản phẩm mới|Sửa sản phẩm/ }),
    });
    this.nameInput = this.productForm.getByPlaceholder('Tên sản phẩm');
    this.priceInput = this.productForm.getByPlaceholder('Giá tiền');
    this.imageUrlInput = this.productForm.getByPlaceholder('URL Ảnh');
    this.descriptionInput = this.productForm.getByPlaceholder('Mô tả');
    this.categorySelect = this.productForm.locator('select');
    this.saveButton = this.productForm.getByRole('button', {
      name: 'Lưu sản phẩm',
    });
    this.productTable = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Tên SP' }),
    });
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

  async saveProduct(): Promise<void> {
    await this.saveButton.click();
  }

  productRow(name: string): Locator {
    return this.productTable.getByRole('row').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async editProduct(name: string): Promise<void> {
    await this.productRow(name).getByRole('button', { name: 'Sửa' }).click();
  }

  async deleteProduct(name: string): Promise<void> {
    await this.productRow(name).getByRole('button', { name: 'Xóa' }).click();
  }
}
