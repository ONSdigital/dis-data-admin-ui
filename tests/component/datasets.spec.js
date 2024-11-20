import { test, expect } from '@playwright/test';

test.describe('datasets', () => {
    test("works as it should", async ({ page, context }) => {
        // add fake auth cookie
        await context.addCookies([
            { name: 'session', value: 'true', path: '/',  domain: '127.0.0.1'}
        ]);

        await page.goto('./datasets')
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Find a dataset');

        await page.getByRole('textbox').fill('deaths');
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('heading', { level: 2 })).toContainText('Weekly deaths');
    });
});