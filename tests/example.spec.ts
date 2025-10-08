import { test, expect } from '@playwright/test';

test.describe('Example Test Suite', () => {
  test('has title', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('search functionality', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Open search dialog
    await page.getByLabel('Search').click();
    
    // Type search query
    await page.getByPlaceholder('Search docs').fill('test');
    
    // Verify search results appear
    await expect(page.getByRole('link', { name: /test/i }).first()).toBeVisible();
  });
});

test.describe('API Testing Example', () => {
  test('should get response from API', async ({ request }) => {
    const response = await request.get('https://playwright.dev/');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});
