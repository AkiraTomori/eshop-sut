import { expect, type Page } from '@playwright/test';

/**
 * Shared base class for EShop page objects.
 *
 * Feature-specific locators belong in subclasses. URLs are supplied from
 * test-environment.json through fixtures; this class never hardcodes SUT data.
 */
export abstract class BasePage {
  constructor(
    public readonly page: Page,
    private readonly baseUrl: string,
  ) {}

  protected resolveUrl(route: string): string {
    return new URL(route, `${this.baseUrl.replace(/\/$/, '')}/`).toString();
  }

  protected async navigate(route: string): Promise<void> {
    await this.page.goto(this.resolveUrl(route));
  }

  async expectUrl(route: string): Promise<void> {
    await expect(this.page).toHaveURL(this.resolveUrl(route));
  }
}
