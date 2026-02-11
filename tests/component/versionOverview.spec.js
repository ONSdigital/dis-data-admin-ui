import { test, expect } from '@playwright/test';

import { setValidAuthCookies } from "../utils/utils";

test.describe("Version overview page", () => {
    test("Route from list of version to version overview page", async ({ page, context }) => {
        setValidAuthCookies(context);
        await page.goto('./series/mock-quarterly/editions/time-series');
        await expect(page.url().toString()).toContain('series/mock-quarterly/editions/time-series');
        await page.getByRole('link', { name: 'Version: 1' }).click();
        await page.waitForURL('**/series/mock-quarterly/editions/time-series/versions/1');
        await expect(page.url().toString()).toContain('series/mock-quarterly/editions/time-series/versions/1');
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
        await expect(page.getByTestId('id-field')).toContainText('mock-quarterly');
        await expect(page.getByTestId('edition-field')).toContainText('time-series');
        await expect(page.getByTestId('edition-title-field')).toContainText('This is an edition title for version 1');
        await expect(page.getByTestId('release-date-field')).toContainText('26 January 2025');
        await expect(page.getByTestId('version-field')).toContainText('1');
        await expect(page.getByTestId('last-updated-field')).toContainText('26 February 2025');
        await expect(page.getByTestId('quality-designation-field')).toContainText('National Statistic');
        await expect(page.getByTestId("usage-note-title-0")).toContainText("Usage Note 1");
        await expect(page.getByTestId("usage-note-text-0")).toContainText("This is a usage note for version 1");
        await expect(page.getByTestId("usage-note-title-1")).toContainText("Usage Note 2");
        await expect(page.getByTestId("usage-note-text-1")).toContainText("This is another usage note for version 1");
        await expect(page.getByTestId("alert-type-0")).toContainText("Notice");
        await expect(page.getByTestId("alert-description-0")).toContainText("This is an alert for version 1");
        await expect(page.getByTestId("alert-type-1")).toContainText("Correction");
        await expect(page.getByTestId("alert-description-1")).toContainText("This is a correction for version 1");
        await expect(page.getByTestId("distribution-title-0")).toContainText("Full Dataset (CSV)");
        await expect(page.getByTestId("distribution-format-0")).toContainText("csv");
        await expect(page.getByTestId("distribution-media-type-0")).toContainText("text/csv");
        await expect(page.getByTestId("distribution-byte-size-0")).toContainText("4300000 bytes");
        await expect(page.getByTestId("distribution-download-url-0")).toHaveAttribute("href", "http://localhost:23600/downloads-new/datasets/RM086/editions/2021/versions/1.csv");
        await expect(page.getByTestId("distribution-title-1")).toContainText("Full Dataset (XLS)");
        await expect(page.getByTestId("distribution-format-1")).toContainText("xls");
        await expect(page.getByTestId("distribution-media-type-1")).toContainText("application/vnd.ms-excel");
        await expect(page.getByTestId("distribution-byte-size-1")).toContainText("265000 bytes");
        await expect(page.getByTestId("distribution-download-url-1")).toHaveAttribute("href", "http://localhost:23600/downloads-new/datasets/RM086/editions/2021/versions/1.xls");
    });

    test("Minimally populated version page renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);
        await page.goto("./series/mock-minimal/editions/time-series/versions/2");
        await expect(page.getByTestId('id-field')).toContainText('mock-minimal');
        await expect(page.getByTestId('edition-field')).toContainText('time-series');
        await expect(page.getByTestId('edition-title-field')).toContainText('This is an edition title for version 2');
        await expect(page.getByTestId('release-date-field')).toContainText('26 January 2025');
        await expect(page.getByTestId('version-field')).toContainText('2');
        await expect(page.getByTestId('last-updated-field')).toContainText('26 February 2025');
        await expect(page.getByTestId('quality-designation-field')).not.toBeVisible();
        await expect(page.locator("h2", { hasText: "Usage Notes" })).not.toBeVisible();
        await expect(page.locator("h2", { hasText: "Alerts" })).not.toBeVisible();
        await expect(page.getByTestId("distribution-title-0")).toContainText("Full Dataset (CSV)");
        await expect(page.getByTestId("distribution-format-0")).toContainText("csv");
        await expect(page.getByTestId("distribution-media-type-0")).toContainText("text/csv");
        await expect(page.getByTestId("distribution-byte-size-0")).toContainText("4300000 bytes");
        await expect(page.getByTestId("distribution-download-url-0")).toHaveAttribute("href", "http://localhost:23600/downloads-new/datasets/RM086/editions/2021/versions/1.csv");
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