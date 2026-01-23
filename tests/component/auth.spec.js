import { test, expect } from "@playwright/test";

import { createValidJWTCookieValue, createExpiredJWTCookieValue, createValidJWTCookieValueWithRoleDetails, setExpiredAuthCookies, setValidAuthCookies } from "../utils/utils";

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

// test.describe("Role headers", () => {
//     test("are not set when no user has no assigned roles", async ({ page, context }) => {
//         await context.addCookies([
//             { name: "id_token", value: createValidJWTCookieValueWithRoleDetails(), path: "/",  domain: "127.0.0.1"},
//             { name: "access_token", value: createValidJWTCookieValueWithRoleDetails(), path: "/",  domain: "127.0.0.1"}
//         ]);
//         await page.goto("./series")
//         page.on("request", async (response) => {
//             const headerValue = await response.headers();
//             console.log("header value:", headerValue);
//         });

//         await page.waitForTimeout(30000);
//         await expect(page).toHaveURL(/.*\/florence\/login\?redirect=%2Fdata-admin%2F%2Fseries/);
//         await expect(page.getByRole("heading", { level: 1 })).not.toContainText("Dataset series");
        

//     });
// });
