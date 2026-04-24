import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Version overview page", () => {
    test("Route from list of version to version overview page", async ({ page, context }) => {
        setValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series");
        await page.getByRole("link", { name: "Version: 1" }).click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series/versions/1");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/1");
    });

    test("Page heading create button routes to create new version page", async ({ page, context }) => {
        setValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly/editions/time-series/versions/1");
        await page.getByTestId("page-heading-create-button").click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series/versions/create?edition_title=This%20is%20an%20edition%20title%20for%20version%201");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/create?edition_title=This%20is%20an%20edition%20title%20for%20version%201");
    });

    test("Page heading 'back to' link routes to edition overview page", async ({ page, context }) => {
        setValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly/editions/time-series/versions/1");
        await page.getByTestId("page-heading-link").click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series");
    });

    test("Fully populated version page renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series/versions/1");

        // page heading
        await expect(page.getByTestId("page-heading-title")).toContainText("Version: 1");
        await expect(page.getByTestId("page-heading-subtitle")).toContainText("Version");
        await expect(page.getByTestId("page-heading-create-button")).toContainText("Create new version");
        await expect(page.getByTestId("page-heading-link")).toContainText("Back to edition overview");

        // page content
        await expect(page.locator("#version-id")).toContainText("1");
        await expect(page.locator("#series")).toContainText("Consumer price inflation tables");
        await expect(page.locator("#edition")).toContainText("time-series");
        await expect(page.locator("#edition-title")).toContainText("This is an edition title for version 1");
        await expect(page.locator("#edition")).toContainText("time-series");
        await expect(page.locator("#state")).toContainText("Published");
        await expect(page.locator("#release-date")).toContainText("26 January 2025");
        await expect(page.locator("#last-updated")).toContainText("26 February 2025");
        await expect(page.locator("#quality-designation")).toContainText("National Statistic");
        await expect(page.getByTestId("version-usage-notes-title-0")).toContainText("Usage Note 1");
        await expect(page.getByTestId("version-usage-notes-description-0")).toContainText("This is a usage note for version 1");
        await expect(page.getByTestId("version-usage-notes-title-1")).toContainText("Usage Note 2");
        await expect(page.getByTestId("version-usage-notes-description-1")).toContainText("This is another usage note for version 1");
        await expect(page.getByTestId("version-alerts-title-0")).toContainText("alert");
        await expect(page.getByTestId("version-alerts-description-0")).toContainText("This is an alert for version 1");
        await expect(page.getByTestId("version-alerts-title-1")).toContainText("correction");
        await expect(page.getByTestId("version-alerts-description-1")).toContainText("This is a correction for version 1");
        await expect(page.getByTestId("version-file-download-title-0")).toContainText("Full Dataset (CSV)");
        await expect(page.getByTestId("version-file-download-download-0")).toHaveAttribute("href", "http://localhost:23600/downloads/files/uuid-1/full-dataset.csv");
        await expect(page.getByTestId("version-file-download-title-1")).toContainText("Full Dataset (XLS)");
        await expect(page.getByTestId("version-file-download-download-1")).toHaveAttribute("href", "http://localhost:23600/downloads/files/uuid-2/full-dataset.xls");
    });

    test("Minimally populated version page renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);
        await page.goto("./series/mock-minimal/editions/time-series/versions/2");
        await expect(page.locator("#version-id")).toContainText("2");
        await expect(page.locator("#series")).toContainText("Minimal mock dataset");
        await expect(page.locator("#edition")).toContainText("time-series");
        await expect(page.locator("#edition-title")).toContainText("This is an edition title for version 2");
        await expect(page.locator("#release-date")).toContainText("26 January 2025");
        await expect(page.locator("#last-updated")).toContainText("26 February 2025");
        await expect(page.locator("#quality-designation")).not.toBeVisible();
        await expect(page.getByTestId("version-usage-notes-title-0")).not.toBeVisible();
        await expect(page.getByTestId("version-alerts-title-0")).not.toBeVisible();
        await expect(page.getByTestId("version-file-download-title-0")).toContainText("Full Dataset (CSV)");
        await expect(page.getByTestId("version-file-download-download-0")).toHaveAttribute("href", "http://localhost:23600/downloads/files/uuid-1/full-dataset.csv");
    });

    test("Shows version delete button when version is unpublished", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-minimal/editions/time-series/versions/2");
        await expect(page.getByTestId("delete-version-button")).toBeVisible();
    });

    test("Does not show version delete button when dataset is published", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/1");
        await expect(page.getByTestId("delete-version-button")).not.toBeVisible();
    });

    test.describe("Handles API error", () => {
        test("When 404 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/time-series/versions/404");
            await expect(page.getByText("There was an issue retrieving the data for this page. Try refreshing the page.")).toBeVisible();
        });

         test("When 500 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/time-series/versions/500");
            await expect(page.getByText("There was an issue retrieving the data for this page. Try refreshing the page.")).toBeVisible();
        });
    });
});