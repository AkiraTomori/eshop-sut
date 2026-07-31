import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  readonly heading: Locator;
  readonly totalInput: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly checkoutButton: Locator;

  constructor(
    page: Page,
    baseUrl: string,
    private readonly checkoutRoute: string,
  ) {
    super(page, baseUrl);
    this.heading = page.getByRole('heading', {
      name: 'Xác Nhận Đơn Hàng',
    });
    this.totalInput = page.locator('input[type="number"]');
    this.couponInput = page.getByPlaceholder('Nhập mã giảm giá...');
    this.applyCouponButton = page.getByRole('button', { name: 'Áp dụng' });
    this.checkoutButton = page.getByRole('button', {
      name: 'Xác Nhận Thanh Toán',
    });
  }

  async open(): Promise<void> {
    await this.navigate(this.checkoutRoute);
  }

  async fillCoupon(code: string): Promise<void> {
    await this.couponInput.fill(code);
  }

  async applyCoupon(): Promise<void> {
    await this.applyCouponButton.click();
  }

  async submitCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
