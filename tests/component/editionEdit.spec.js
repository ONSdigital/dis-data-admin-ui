import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Edit edition page", () => {
    test.describe("When editing a unpublished edition", () => {
        test("Renders as expected", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/test-edition/edit");
            await expect(page.getByTestId("page-heading-title")).toContainText("Edit edition: Test edition");

            await expect(page.getByTestId("edition-id")).toBeVisible();
            await expect(page.getByTestId("edition-title")).toBeVisible();
            await expect(page.getByTestId("edition-save-button")).toBeVisible();
            await expect(page.getByTestId("related-content-title-0")).toHaveValue("");
            await expect(page.getByTestId("related-content-url-0")).toHaveValue("");
            await expect(page.getByTestId("related-content-description-0")).toHaveValue("");
            await expect(page.getByTestId("related-content-add-button")).toHaveClass(/ons-btn--disabled/);
        });

        test("Submits form successfully", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/test-edition/edit");
            await page.getByTestId("edition-id").fill(" test-id ");
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

        test("Submits form successfully with related content", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/test-edition/edit");

            await page.getByTestId("related-content-title-0").fill("Related article");
            await page.getByTestId("related-content-url-0").fill("https://example.com/article");
            await page.getByTestId("related-content-description-0").fill("Some description");
            await page.getByTestId("related-content-add-button").click();
            await page.getByTestId("related-content-title-1").fill("Another article");
            await page.getByTestId("related-content-url-1").fill("https://example.com/another");

            await page.getByRole("button", { name: /Save edition/i }).click();

            await page.waitForURL("**/series/mock-quarterly/editions/test-edition**");
            await expect(page.getByText("Dataset edition saved")).toBeVisible();
        });

        test("Show errors on mandatory fields", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/test-edition/edit");

            await page.getByTestId("edition-id").fill("");
            await page.getByTestId("edition-title").fill("");

            await page.getByRole("button", { name: /Save edition/i }).click();

            await expect(page.getByText("There was a problem creating this dataset edition")).toBeVisible();
            await expect(page.getByLabel("There was a problem").getByText("Edition ID is required")).toBeVisible();
            await expect(page.getByLabel("There was a problem").getByText("Edition title is required")).toBeVisible();
        });

        test("Show error when edition ID contains invalid characters", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/test-edition/edit");

            await page.getByTestId("edition-id").fill("id with spaces");

            await page.getByRole("button", { name: /Save edition/i }).click();

            await expect(page.getByText("There was a problem creating this dataset edition")).toBeVisible();
            await expect(page.getByLabel("There was a problem").getByText("Edition ID can only contain letters, numbers and dashes")).toBeVisible();
        });
    });

    test.describe("When editing a published edition", () => {
        test("Renders as expected", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/time-series/edit");
            await expect(page.getByTestId("page-heading-title")).toContainText("Edit edition: Timeseries");

            await expect(page.getByTestId("edition-id")).not.toBeVisible();
            await expect(page.getByTestId("edition-title")).toBeVisible();
            await expect(page.getByTestId("edition-save-button")).toBeVisible();
            await expect(page.getByTestId("related-content-title-0")).toHaveValue("Related article");
            await expect(page.getByTestId("related-content-url-0")).toHaveValue("https://example.com/article");
            await expect(page.getByTestId("related-content-description-0")).toHaveValue("About the article");
            await expect(page.getByTestId("related-content-title-1")).toHaveValue("Another article");
            await expect(page.getByTestId("related-content-url-1")).toHaveValue("https://example.com/another");
            await expect(page.getByTestId("related-content-title-2")).not.toBeVisible();
        });

        test("Submits form successfully", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/time-series/edit");
            await page.getByTestId("edition-title").fill("Test title");


            await page.getByRole("button", { name: /Save edition/i }).click();

            await page.waitForURL("**/series/mock-quarterly/editions/time-series**");
            await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series");

            await expect(page.getByText("Dataset edition saved")).toBeVisible();
        });

        test("Show errors on mandatory fields", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/time-series/edit");

            await page.getByTestId("edition-title").fill("");

            await page.getByRole("button", { name: /Save edition/i }).click();

            await expect(page.getByText("There was a problem creating this dataset edition")).toBeVisible();
            await expect(page.getByLabel("There was a problem").getByText("Edition title is required")).toBeVisible();
        });
    });

    test.describe("Related content", () => {
        test("Add button only enables once title and URL are filled", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/test-edition/edit");

            await page.getByTestId("related-content-title-0").fill("Related article");
            await expect(page.getByTestId("related-content-add-button")).toHaveClass(/ons-btn--disabled/);

            await page.getByTestId("related-content-url-0").fill("https://example.com/article");
            await expect(page.getByTestId("related-content-add-button")).not.toHaveClass(/ons-btn--disabled/);

            await page.getByTestId("related-content-add-button").click();
            await expect(page.getByTestId("related-content-title-1")).toBeVisible();
        });

        test("Shows error only on URL when URL is missing", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/test-edition/edit");

            await page.getByTestId("related-content-title-0").fill("Related article");
            await page.getByRole("button", { name: /Save edition/i }).click();

            await expect(page.getByLabel("There was a problem").getByText("Related content URL is required")).toBeVisible();
            await expect(page.getByTestId("field-related-content-url-0-error")).toContainText("Related content URL is required");
            await expect(page.getByTestId("field-related-content-title-0-error")).not.toBeVisible();

            // entered values are kept after failed validation
            await expect(page.getByTestId("related-content-title-0")).toHaveValue("Related article");
        });

        test("Shows error only on title when title is missing", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/test-edition/edit");

            await page.getByTestId("related-content-url-0").fill("https://example.com/article");
            await page.getByRole("button", { name: /Save edition/i }).click();

            await expect(page.getByLabel("There was a problem").getByText("Related content title is required")).toBeVisible();
            await expect(page.getByTestId("field-related-content-title-0-error")).toContainText("Related content title is required");
            await expect(page.getByTestId("field-related-content-url-0-error")).not.toBeVisible();
        });

        test("Shows errors on the correct row when multiple rows are invalid", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/test-edition/edit");

            await page.getByTestId("related-content-title-0").fill("Row 0 title");
            await page.getByTestId("related-content-url-0").fill("https://example.com/0");
            await page.getByTestId("related-content-add-button").click();
            await page.getByTestId("related-content-url-1").fill("https://example.com/1");
            // clear row 0's URL after adding row 1, as the add button needs a complete row
            await page.getByTestId("related-content-url-0").fill("");

            await page.getByRole("button", { name: /Save edition/i }).click();

            await expect(page.getByTestId("field-related-content-url-0-error")).toBeVisible();
            await expect(page.getByTestId("field-related-content-title-0-error")).not.toBeVisible();
            await expect(page.getByTestId("field-related-content-title-1-error")).toBeVisible();
            await expect(page.getByTestId("field-related-content-url-1-error")).not.toBeVisible();
        });
    });

    test.describe("When editing a migrated edition", () => {
        test("Renders as expected", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/editions/migrationed-edition/edit");
            await expect(page.getByTestId("page-heading-title")).toContainText("Edit edition: Migrated edition");

            await expect(page.getByTestId("edition-id")).not.toBeVisible();
            await expect(page.getByTestId("edition-title")).toBeVisible();
            await expect(page.getByTestId("edition-save-button")).toBeVisible();
        });
    });

    test.describe("Handles API error", () => {
        test("When 404 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/404/edit");
            await expect(page.getByText("There was a problem retreiving data for this page. Please try again later.")).toBeVisible();
        });

        test("When 500 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/mock-quarterly/editions/500/edit");
            await expect(page.getByText("There was a problem retreiving data for this page. Please try again later.")).toBeVisible();
        });
    });
});
