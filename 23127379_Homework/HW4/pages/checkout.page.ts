import { type Dialog, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

type CheckoutRoutes = {
  home: string;
  cart: string;
  profile: string;
};

type CheckoutLabels = {
  home: string;
  cart: string;
  addToCart: string;
  remove: string;
  proceedToCheckout: string;
  checkoutButton: string;
  updateProfile: string;
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
    this.allPrimaryHeadings = page.getByRole('heading', { level: 1 });
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

  async updateProfileShippingAddress(
    routes: CheckoutRoutes,
    labels: CheckoutLabels,
    phonePlaceholder: string,
    phone: string,
    addressPlaceholder: string,
    address: string,
  ): Promise<string> {
    await this.openRoute(routes.profile);
    await this.profilePhoneInput(phonePlaceholder).fill(phone);
    await this.profileShippingAddressInput(addressPlaceholder).fill(address);

    const dialogPromise = this.page.waitForEvent('dialog');
    const updatePromise = this.page
      .getByRole('button', { name: labels.updateProfile, exact: true })
      .click();
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.dismiss();
    await updatePromise;
    return message;
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

  cartSummary(label: string, total: string): Locator {
    return this.page
      .getByText(label, { exact: false })
      .filter({ hasText: total });
  }

  checkoutItem(text: string): Locator {
    return this.page.getByRole('listitem', { name: text, exact: true });
  }

  checkoutButton(labels: CheckoutLabels): Locator {
    return this.page.getByRole('button', {
      name: labels.checkoutButton,
      exact: true,
    });
  }

  profilePhoneInput(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder, { exact: true });
  }

  profileShippingAddressInput(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder, { exact: true });
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

  emptyCartIllustration(): Locator {
    return this.page.getByRole('img');
  }

  validationError(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  async isValidationErrorAboveButton(
    errorText: string,
    labels: CheckoutLabels,
  ): Promise<boolean> {
    const errorBox = await this.validationError(errorText).boundingBox();
    const buttonBox = await this.checkoutButton(labels).boundingBox();
    return Boolean(
      errorBox &&
        buttonBox &&
        errorBox.y + errorBox.height <= buttonBox.y,
    );
  }
}
