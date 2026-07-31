import { type Dialog, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

type CheckoutRoutes = {
  home: string;
  cart: string;
  login: string;
};

type CheckoutLabels = {
  home: string;
  cart: string;
  addToCart: string;
  remove: string;
  proceedToCheckout: string;
  checkoutButton: string;
};

export class CheckoutPage extends BasePage {
  readonly primaryHeading: Locator;
  readonly allPrimaryHeadings: Locator;
  readonly checkoutItems: Locator;
  readonly totalInput: Locator;
  readonly couponInput: Locator;

  constructor(
    page: Page,
    baseUrl: string,
    private readonly checkoutRoute: string,
  ) {
    super(page, baseUrl);
    this.primaryHeading = page.getByRole('heading', { level: 1 });
    this.allPrimaryHeadings = page.locator('h1');
    this.checkoutItems = page.getByRole('listitem');
    this.totalInput = page.getByRole('spinbutton');
    this.couponInput = page.getByPlaceholder('Nhập mã giảm giá...');
  }

  async open(): Promise<void> {
    await this.navigate(this.checkoutRoute);
  }

  async openRoute(route: string): Promise<void> {
    await this.navigate(route);
  }

  async prepareCart(
    routes: CheckoutRoutes,
    labels: CheckoutLabels,
    productName: string,
  ): Promise<void> {
    await this.openRoute(routes.home);
    await this.productCard(productName)
      .getByRole('button', { name: labels.addToCart, exact: true })
      .click();
    await this.openCart(labels);
  }

  async proceedFromCart(labels: CheckoutLabels): Promise<void> {
    await this.page
      .getByRole('button', {
        name: labels.proceedToCheckout,
        exact: true,
      })
      .click();
  }

  async openCart(labels: CheckoutLabels): Promise<void> {
    await this.page
      .getByRole('link', { name: labels.cart, exact: true })
      .click();
  }

  async submitCheckout(labels: CheckoutLabels): Promise<void> {
    await this.checkoutButton(labels).click();
  }

  async fillShippingAddress(label: string, address: string): Promise<void> {
    await this.shippingAddressInput(label).fill(address);
  }

  async cleanupCart(labels: CheckoutLabels): Promise<void> {
    await this.openCart(labels);
    const removeButtons = this.page.getByRole('button', {
      name: labels.remove,
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

    await this.page
      .getByRole('link', { name: labels.home, exact: true })
      .click();
  }

  productCard(productName: string): Locator {
    return this.page
      .getByRole('heading', { name: productName, exact: true })
      .locator('..');
  }

  cartRows(productName: string): Locator {
    return this.page.getByRole('row').filter({ hasText: productName });
  }

  checkoutButton(labels: CheckoutLabels): Locator {
    return this.page.getByRole('button', {
      name: labels.checkoutButton,
      exact: true,
    });
  }

  shippingAddressInput(label: string): Locator {
    return this.page.getByLabel(label, { exact: true });
  }

  breadcrumb(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  totalText(text: string | RegExp): Locator {
    return this.page.getByText(text, { exact: true });
  }

  successMessage(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  emptyCartMessage(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  emptyCartIllustration(message: string): Locator {
    return this.emptyCartMessage(message).locator('..').getByRole('img');
  }

  authenticationError(text: string): Locator {
    return this.page.getByText(text);
  }

  validationError(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  validationErrorBeforeButton(
    errorText: string,
    labels: CheckoutLabels,
  ): Locator {
    return this.validationError(errorText)
      .locator('~ button')
      .filter({ hasText: labels.checkoutButton });
  }
}
