import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Edition overview page", () => {
    test("Renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series");

        // page heading
        await expect(page.getByTestId("page-heading-title")).toContainText("Mock Dataset: Timeseries");
        await expect(page.getByTestId("page-heading-subtitle")).toContainText("Edition");
        await expect(page.getByTestId("page-heading-create-button")).toContainText("Create new version");
        await expect(page.getByTestId("page-heading-link")).toContainText("Back to series overview");

        // version list
        await expect(page.getByRole("link", { name: "Version: 1" })).toBeVisible();
        // page content
        await expect(page.locator("#edition-id")).toContainText("time-series");
        await expect(page.locator("#edition-title")).toContainText("Timeseries");
        await expect(page.getByTestId("action-link-edition-title")).toBeVisible();
        await expect(page.locator("#release-date")).toContainText("26 January 2025"); 
    });

    test("Page heading create button routes to create new version page", async ({ page, context }) => {
        setValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly/editions/time-series");
        await page.getByTestId("page-heading-create-button").click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series/versions/create?edition_title=Timeseries");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/create?edition_title=Timeseries");
    });

    test("Page heading 'back to' link routes to series list page", async ({ page, context }) => {
        setValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly/editions/time-series");
        await page.getByTestId("page-heading-link").click();
        await page.waitForURL("**/series/mock-quarterly");
        await expect(page.url().toString()).toContain("series/mock-quarterly");
    });

    test("Page heading displays panel stating 'cannot create new dataset' because of unpublished dataset version", async ({ page, context }) => {
        setValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly/editions/time-series-unpublished");
        await expect(page.getByTestId("page-heading-panel")).toContainText("An unpublished version exists so cannot add new dataset version.");
    });

    test("Routes to version overview page when selecting version from list", async ({ page, context }) => {
        setValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series");
        await page.getByRole("link", { name: "Version: 1" }).click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series/versions/1");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/1");
    });

    test.describe("Handles API error", () => {
        test("When 404 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/404");
            await expect(page.getByText("There was an issue retrieving the data for this page. Try refreshing the page.")).toBeVisible();
        });

         test("When 500 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/500");
            await expect(page.getByText("There was an issue retrieving the data for this page. Try refreshing the page.")).toBeVisible();
        });
    });
});