import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Series overview page", () => {
    test("renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");

        // page heading
        await expect(page.getByTestId("page-heading-title")).toContainText("Mock Dataset");
        await expect(page.getByTestId("page-heading-subtitle")).toContainText("Series");
        await expect(page.getByTestId("page-heading-create-button")).toContainText("Create new edition");
        await expect(page.getByTestId("page-heading-back-link")).toContainText("Back to dataset series list");

        // editions list
        await expect(page.getByRole("link", { name: "Timeseries" })).toBeVisible();

        // body content
        await expect(page.locator("#series-id")).toContainText("mock-quarterly");
        await expect(page.locator("#type")).toContainText("static");
        await expect(page.locator("#title")).toContainText("Mock Dataset");
        await expect(page.getByTestId("edit-title")).toBeVisible();
        await expect(page.locator("#description")).toContainText("This is a mock dataset test description");
        await expect(page.getByTestId("edit-description")).toBeVisible();
        await expect(page.locator("#topics")).toContainText("Business, industry and trade");
        await expect(page.locator("#topics")).toContainText("Census");
        await expect(page.getByTestId("edit-topics")).toBeVisible();
        await expect(page.locator("#last-updated")).toContainText("1 January 2000");
        await expect(page.locator("#licence")).toContainText("My License");
        await expect(page.locator("#next-release")).toContainText("TBC");
        await expect(page.locator("#keywords")).toContainText("mock");
        await expect(page.locator("#keywords")).toContainText("test");
        await expect(page.locator("#qmi")).toContainText("https://www.ons.gov.uk");
    });

    test("page heading create button routes to create new edition page", async ({ page, context }) => {
        addValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly");
        await page.getByTestId("page-heading-create-button").click();
        await page.waitForURL("**/series/mock-quarterly/editions/create");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/create");
    });

    test("page heading 'back to' link routes to series list page", async ({ page, context }) => {
        addValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly");
        await page.getByTestId("page-heading-back-link").click();
        await page.waitForURL("**/series");
        await expect(page.url().toString()).toContain("series");
    });


    test("routes to edition overview page when selecting edition from list", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");
        await page.getByRole("link", { name: "Timeseries" }).click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series");
    });
});