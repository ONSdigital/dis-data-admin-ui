import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Migration list page", () => {
    test("Renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration")
        await expect(page.getByText("Showing 1 to 5 of 5 jobs")).toBeVisible();
        await expect(page.getByRole("link", { name: "1" })).toBeVisible();
        await expect(page.getByTestId("create-migration-job-button")).toBeVisible();
        await expect(page.getByTestId("migration-list-table")).toBeVisible();
    });
});