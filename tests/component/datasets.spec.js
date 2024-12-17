import { test, expect } from '@playwright/test';

test.describe('datasets', () => {
    test("works as it should", async ({ page, context }) => {
        // add fake auth cookie
        await context.addCookies([
            { name: 'session', value: 'true', path: '/',  domain: '127.0.0.1'}
        ]);

        await page.goto('./datasets')
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Datasets');
        await expect(page.getByText('Weekly deaths')).toBeVisible();
    });

    test("Route from Datasets page to Create Dataset page", async ({ page, context }) => {
        // add fake auth cookie
        await context.addCookies([
            { name: 'session', value: 'true', path: '/',  domain: '127.0.0.1'}
        ]);

        await page.goto('./datasets')
        await page.getByRole('link', { name: /Create/i }).click();
        await expect(page.getByText('Create Dataset Page')).toBeVisible();
    });
});