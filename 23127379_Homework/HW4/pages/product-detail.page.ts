import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productImage: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;

  constructor(
    page: Page,
    baseUrl: string,
    private readonly productRoutePrefix: string,
  ) {
    super(page, baseUrl);
    this.productName = page.getByRole('heading', { level: 1 });
    this.productImage = page.locator('img[alt]:not([alt=""])').first();
    this.quantityInput = page.locator('input[type="number"]');
    this.addToCartButton = page.getByRole('button', {
      name: /Thêm vào giỏ hàng|Đã thêm/,
    });
  }

  async open(productId: string | number): Promise<void> {
    await this.navigate(
      `${this.productRoutePrefix}${encodeURIComponent(String(productId))}`,
    );
  }

  async setQuantity(quantity: string | number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
