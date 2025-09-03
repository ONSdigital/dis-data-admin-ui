import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Edition overview page", () => {
    test("renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series");

        // page heading
        await expect(page.getByTestId("page-heading-title")).toContainText("Mock Dataset: Timeseries");
        await expect(page.getByTestId("page-heading-subtitle")).toContainText("Edition");
        await expect(page.getByTestId("page-heading-create-button")).toContainText("Create new version");
        await expect(page.getByTestId("page-heading-back-link")).toContainText("Back to dataset series list");

        // version list
        await expect(page.getByRole("link", { name: "Version: 1" })).toBeVisible();

        // page content
        await expect(page.getByTestId("id-field")).toContainText("time-series");
        await expect(page.getByTestId("title-field")).toContainText("Timeseries");
        await expect(page.getByTestId("release-date-field")).toContainText("26 January 2025");
    });

    // test("routes to create new edition page", async ({ page, context }) => {
    //     addValidAuthCookies(context);
    //     await page.goto("./series/mock-quarterly/editions/time-series");
    //     await page.getByRole("link", { name: "Add new dataset version" }).click();
    //     await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/create?edition_title=Timeseries");
    // });

    // test("routes to create new edition page with unpublished version", async ({ page, context }) => {
    //     addValidAuthCookies(context);
    //     await page.goto("./series/mock-quarterly/editions/time-series-unpublished");
    //     await expect(page.getByText("Unpublished version exists, cannot add new dataset version.")).toBeVisible();
    // });

    test("page heading create button routes to create new edition page", async ({ page, context }) => {
        addValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly/editions/time-series");
        await page.getByTestId("page-heading-create-button").click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series/versions/create?edition_title=Timeseries");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/create?edition_title=Timeseries");
    });

    test("page heading 'back to' link routes to series list page", async ({ page, context }) => {
        addValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly/editions/time-series");
        await page.getByTestId("page-heading-back-link").click();
        await page.waitForURL("**/series/mock-quarterly");
        await expect(page.url().toString()).toContain("series/mock-quarterly");
    });

    test("routes to version overview page when selecting version from list", async ({ page, context }) => {
        addValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series");
        await page.getByRole("link", { name: "Version: 1" }).click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series/versions/1");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/1");
    });
});