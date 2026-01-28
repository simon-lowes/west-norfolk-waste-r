import { test, expect } from '@playwright/test';

const BASE = process.env.E2E_BASE || 'http://localhost:5173';

test.describe('Smoke test', () => {
  test('app loads without fatal JS errors', async ({ page }) => {
    const fatalErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          text.includes('Minified React error') ||
          text.includes('ChunkLoadError') ||
          text.includes('Uncaught') ||
          text.includes('Cannot read properties of undefined') ||
          text.includes('is not a function')
        ) {
          fatalErrors.push(text);
        }
      }
    });

    page.on('pageerror', (error) => {
      // Ignore expected CI errors from missing external service credentials
      if (error.message.includes('Failed to fetch KV key')) return;

      fatalErrors.push(error.message);
    });

    await page.goto(BASE, { waitUntil: 'networkidle' });

    await expect(page).toHaveTitle('West Norfolk Waste & Recycling');

    const root = page.locator('#root');
    await expect(root).not.toBeEmpty();

    expect(fatalErrors, 'Fatal JS errors detected').toEqual([]);
  });
});
