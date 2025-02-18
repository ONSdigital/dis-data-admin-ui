import { test, expect } from '@playwright/test';

import { createValidJWTCookieValue } from "../utils/utils";

test.describe('dataset seriesoverview/editions list page', () => {
    test("renders as expected", async ({ page, context }) => {
        // add auth cookie
        await context.addCookies([
            { name: 'id_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'},
            { name: 'access_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'}
        ]);

        await page.goto('./series/mock-quarterly');
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Mock Dataset');
        await expect(page.getByRole('link', { name: 'time-series' })).toBeVisible();
        await expect(page.getByTestId('id-field')).toContainText('mock-quarterly');
        await expect(page.getByTestId('description-field')).toContainText('This is a mock dataset test description');
    });

    test("routes to create new edition page", async ({ page, context }) => {
        // add auth cookie
        await context.addCookies([
            { name: 'id_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'},
            { name: 'access_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'}
        ]);

        await page.goto('./series/mock-quarterly');
        await page.getByRole('link', { name: 'Add new dataset edition' }).click();
        await expect(page.url().toString()).toContain('series/mock-quarterly/create');
    });

    test("routes to edition overview page when selecting edition from list", async ({ page, context }) => {
        // add auth cookie
        await context.addCookies([
            { name: 'id_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'},
            { name: 'access_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'}
        ]);

        await page.goto('./series/mock-quarterly');
        await page.getByRole('link', { name: 'time-series' }).click();
        await expect(page.url().toString()).toContain('series/mock-quarterly/editions/time-series');
    });
});