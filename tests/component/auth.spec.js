import { test, expect } from "@playwright/test";

import { createValidJWTCookieValue, createExpiredJWTCookieValue } from "../utils/utils";

test.describe("Auth middleware", () => {
    test("when no cookie is set, doesn't allow access and redirects to login page", async ({ page, context }) => {
        await page.goto("./series")
        await expect(page).toHaveURL(/.*\/florence\/login\?redirect=%2Fdata-admin%2F%2Fseries/);
        await expect(page.getByRole("heading", { level: 1 })).not.toContainText("Dataset series");
    });

    test("when an expired cookie is set, doesn't allow access and redirects to login page", async ({ page, context }) => {
        await context.addCookies([
            { name: "id_token", value: createExpiredJWTCookieValue(), path: "/",  domain: "127.0.0.1"}
        ]);
        await page.goto('./series')
        await expect(page).toHaveURL(/.*\/florence\/login\?redirect=%2Fdata-admin%2F%2Fseries/);
        await expect(page.getByRole('heading', { level: 1 })).not.toContainText('Dataset series');
    });

    test("when a valid cookie is set allows access to a page", async ({ page, context }) => {
        await context.addCookies([
            { name: "id_token", value: createValidJWTCookieValue(), path: "/",  domain: "127.0.0.1"},
            { name: "access_token", value: createValidJWTCookieValue(), path: "/",  domain: "127.0.0.1"}
        ]);
        await page.goto("./series")
        await expect(page).toHaveURL(/.*\/data-admin\/series/);
    });
});
