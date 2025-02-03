import { test, expect } from '@playwright/test';

import { createValidJWTCookieValue } from "../utils/utils";

test.describe('series', () => {
    test("Works as it should", async ({ page, context }) => {
        // add auth cookie
        await context.addCookies([
            { name: 'id_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'},
            { name: 'access_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'}
        ]);

        await page.goto('./series')
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Dataset Series');
        await expect(page.getByRole('link', { name: 'Weekly deaths' })).toBeVisible();
    });

    test("Route from Series page to Create Dataset page", async ({ page, context }) => {
        // add auth cookie
        await context.addCookies([
            { name: 'id_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'},
            { name: 'access_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'}
        ]);

        await page.goto('./series')
        await page.getByRole('link', { name: 'Add New Dataset Series' }).click();
        await expect(page.getByText('Create Dataset Series Page')).toBeVisible();
    });

    test("Choose from a list of datasets and route to chosen dataset page", async ({ page, context }) => {
        // add auth cookie
        await context.addCookies([
            { name: 'id_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'},
            { name: 'access_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'}
        ]);

        await page.goto('./series')
        await page.getByRole('link', { name: 'Test dataset' }).click();
        await expect(page.getByText('test-dataset')).toBeVisible();
        await expect(page.getByText('Select an edition to view or edit')).toBeVisible();
    });
});
