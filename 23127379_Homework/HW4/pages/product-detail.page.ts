import { type Dialog, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

type FocusTarget =
  | 'home'
  | 'cart'
  | 'login'
  | 'register'
  | 'quantity'
  | 'addToCart';

type NavigationLabels = {
  home: string;
  cart: string;
  login: string;
  register: string;
};

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productImage: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly pageHeadings: Locator;
  readonly documentRoot: Locator;
  readonly validationAlert: Locator;

  constructor(
    page: Page,
    baseUrl: string,
    private readonly productRoutePrefix: string,
  ) {
    super(page, baseUrl);
    this.productName = page.getByRole('heading', { level: 1 });
    this.productImage = page.locator('img[alt]:not([alt=""])').first();
    this.productPrice = page.locator('main p.text-2xl');
    this.productDescription = page.locator('main p.text-gray-700');
    this.quantityInput = page.locator('input[type="number"]');
    this.addToCartButton = page.getByRole('button', {
      name: /Thêm vào giỏ hàng|Đã thêm/,
    });
    this.pageHeadings = page.getByRole('heading', { level: 1 });
    this.documentRoot = page.locator('html');
    this.validationAlert = page.getByRole('alert');
  }

  async open(productId: string | number): Promise<void> {
    await this.navigate(
      `${this.productRoutePrefix}${encodeURIComponent(String(productId))}`,
    );
  }

  async setQuantity(quantity: string | number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async typeQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill('');
    await this.quantityInput.pressSequentially(quantity);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async openCart(labels: NavigationLabels): Promise<void> {
    await this.page.getByRole('link', { name: labels.cart, exact: true }).click();
  }

  async returnHome(labels: NavigationLabels): Promise<void> {
    await this.page.getByRole('link', { name: labels.home, exact: true }).click();
  }

  productText(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  categoryText(categoryName: string): Locator {
    return this.page.getByText(categoryName, { exact: true });
  }

  breadcrumb(name: string): Locator {
    return this.page.getByRole('navigation', { name });
  }

  feedback(text: string): Locator {
    return this.addToCartButton.filter({ hasText: text });
  }

  productNotFoundMessage(message: string): Locator {
    return this.page.getByText(message, { exact: true });
  }

  cartRows(productName: string): Locator {
    return this.page.getByRole('row').filter({ hasText: productName });
  }

  cartQuantity(productName: string, quantity: string | number): Locator {
    return this.cartRows(productName).getByRole('cell', {
      name: String(quantity),
      exact: true,
    });
  }

  cartAmount(amount: string): Locator {
    return this.page.getByText(amount, { exact: true });
  }

  cartBadge(labels: NavigationLabels, quantity: string | number): Locator {
    return this.page
      .getByRole('link', { name: labels.cart })
      .getByText(String(quantity), { exact: true });
  }

  focusTarget(target: FocusTarget, labels: NavigationLabels): Locator {
    const targets: Record<FocusTarget, Locator> = {
      home: this.page.getByRole('link', { name: labels.home, exact: true }),
      cart: this.page.getByRole('link', { name: labels.cart, exact: true }),
      login: this.page.getByRole('link', { name: labels.login, exact: true }),
      register: this.page.getByRole('link', {
        name: labels.register,
        exact: true,
      }),
      quantity: this.quantityInput,
      addToCart: this.addToCartButton,
    };

    return targets[target];
  }

  async cleanupCart(labels: NavigationLabels, removeButton: string): Promise<void> {
    await this.openCart(labels);
    const removeButtons = this.page.getByRole('button', {
      name: removeButton,
      exact: true,
    });
    const acceptDialog = (dialog: Dialog) => dialog.accept();

    this.page.on('dialog', acceptDialog);
    try {
      while ((await removeButtons.count()) > 0) {
        await removeButtons.first().click();
      }
    } finally {
      this.page.off('dialog', acceptDialog);
    }

    await this.returnHome(labels);
  }
}
