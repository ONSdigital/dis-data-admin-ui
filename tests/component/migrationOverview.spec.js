import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Migration overview page", () => {
    test("Breadcrumb renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/1")
        await expect(page.getByTestId("breadcrumb-base-link-0")).toBeVisible();
        await expect(page.getByTestId("breadcrumb-base-link-0")).toHaveText("Migration");
        expect(await page.getByTestId("breadcrumb-base-link-0").getAttribute("href")).toBe("/data-admin/migration");
    });

    test("Page header renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/1")
        await expect(page.getByTestId("page-heading-subtitle")).toHaveText("Series");
        await expect(page.getByTestId("page-heading-title")).toHaveText("CPIH");
        await expect(page.getByTestId("page-heading-link")).toBeVisible();
        await expect(page.getByTestId("page-heading-link")).toHaveText("Back to migration jobs list");
    });

    test("Renders as expected when job state is in 'submitted' or 'migrating'", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/2")
        await expect(page.getByText("Dataset series migration is still in progress. Try freshing the page")).toBeVisible();
        await expect(page.getByTestId("migration-job-overview-list")).not.toBeVisible();
    });

    test("Renders as expected when job state in 'in_review' or further", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/1")
        await expect(page.getByText("Dataset series migration is still in progress. Try freshing the page")).not.toBeVisible();
        await expect(page.getByTestId("migration-job-overview-list")).toBeVisible();
        await page.waitForTimeout(60000)

        // body/summary content
        await expect(page.locator("#series-new-dataset")).toContainText("new-dataset");
        await expect(page.locator("#edition-latestversion")).toContainText("latestversion");
        await expect(page.locator("#version-1")).toContainText("1");
        await expect(page.locator("#version-2")).toContainText("2");
        await expect(page.locator("#version-3")).toContainText("3");
        await expect(page.locator("#version-4")).toContainText("4");
        await expect(page.locator("#version-5")).toContainText("5");
    });
});