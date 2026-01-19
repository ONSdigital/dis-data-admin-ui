import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Edit edition page", () => {
    test.describe("When editing a unpublished edition", () => {
        test("Renders as expected", async ({ page, context }) => {
            addValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/test-edition/edit");
            await expect(page.getByTestId("page-heading-title")).toContainText("Edit edition: Test edition");

            await expect(page.getByTestId("edition-id")).toBeVisible();
            await expect(page.getByTestId("edition-title")).toBeVisible();
            await expect(page.getByTestId("edition-save-button")).toBeVisible();
        });

        test("Submits form successfully", async ({ page, context }) => {
            addValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/test-edition/edit");
            await page.getByTestId("edition-id").fill("test-id");
            await page.getByTestId("edition-title").fill("Test title");


            await page.getByRole("button", { name: /Save edition/i }).click();

            await page.waitForURL("**/series/mock-quarterly/editions/test-id**");
            await expect(page.url().toString()).toContain("series/mock-quarterly/editions/test-id");

            // check success message is shown
            await expect(page.getByText("Dataset edition saved")).toBeVisible();

            // check body content loads correctly
            await expect(page.locator("#edition-id")).toContainText("test-id");
            await expect(page.locator("#edition-title")).toContainText("Test edition");
        });

        test("Show errors on mandatory fields", async ({ page, context }) => {
            addValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/test-edition/edit");

            await page.getByTestId("edition-id").fill("");
            await page.getByTestId("edition-title").fill("");

            await page.getByRole("button", { name: /Save edition/i }).click();

            await expect(page.getByText("There was a problem creating this dataset edition")).toBeVisible();
            await expect(page.getByLabel("There was a problem").getByText("Edition ID is required")).toBeVisible();
            await expect(page.getByLabel("There was a problem").getByText("Edition title is required")).toBeVisible();
        });
    });

    test.describe("When editing a published edition", () => {
        test("Renders as expected", async ({ page, context }) => {
            addValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/time-series/edit");
            await expect(page.getByTestId("page-heading-title")).toContainText("Edit edition: Timeseries");

            await expect(page.getByTestId("edition-id")).not.toBeVisible();
            await expect(page.getByTestId("edition-title")).toBeVisible();
            await expect(page.getByTestId("edition-save-button")).toBeVisible();
        });

        test("Submits form successfully", async ({ page, context }) => {
            addValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/time-series/edit");
            await page.getByTestId("edition-title").fill("Test title");


            await page.getByRole("button", { name: /Save edition/i }).click();

            await page.waitForURL("**/series/mock-quarterly/editions/time-series**");
            await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series");

            await expect(page.getByText("Dataset edition saved")).toBeVisible();
        });

        test("Show errors on mandatory fields", async ({ page, context }) => {
            addValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/time-series/edit");

            await page.getByTestId("edition-title").fill("");

            await page.getByRole("button", { name: /Save edition/i }).click();

            await expect(page.getByText("There was a problem creating this dataset edition")).toBeVisible();
            await expect(page.getByLabel("There was a problem").getByText("Edition title is required")).toBeVisible();
        });
    });

    test.describe("Handles API error", () => {
        test("When 404 is returned", async ({ page, context }) => {
            addValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/404/edit");
            await expect(page.getByText("There was a problem retreiving data for this page. Please try again later.")).toBeVisible();
        });

         test("When 500 is returned", async ({ page, context }) => {
            addValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/500/edit");
            await expect(page.getByText("There was a problem retreiving data for this page. Please try again later.")).toBeVisible();
        });
    });
});
