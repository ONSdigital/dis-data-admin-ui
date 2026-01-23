import { test, expect } from "@playwright/test";

import { setExpiredAuthCookies, setValidAuthCookies } from "../utils/utils";

test.describe("Auth middleware", () => {
    test("When no cookie is set, doesn't allow access and redirects to login page", async ({ page, context }) => {
        await page.goto("./series")
        await expect(page).toHaveURL(/.*\/florence\/login\?redirect=%2Fdata-admin%2F%2Fseries/);
        await expect(page.getByRole("heading", { level: 1 })).not.toContainText("Dataset series");
    });

    test("When an expired cookie is set, doesn't allow access and redirects to login page", async ({ page, context }) => {
        setExpiredAuthCookies(context);
        await page.goto("./series");
        await expect(page).toHaveURL(/.*\/florence\/login\?redirect=%2Fdata-admin%2F%2Fseries/);
        await expect(page.getByRole("heading", { level: 1 })).not.toContainText("Dataset series");
    });

    test("When a valid cookie is set allows access to a page", async ({ page, context }) => {
        setValidAuthCookies(context)
        await page.goto("./series")
        await expect(page).toHaveURL(/.*\/data-admin\/series/);
    });
});
