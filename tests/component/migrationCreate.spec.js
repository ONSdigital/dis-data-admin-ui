import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Create migration page", () => {
    test("Renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/create")

        await expect(page.getByTestId("page-heading-title")).toContainText("Create new migration job");
        await expect(page.getByTestId("dataset-series-id")).toBeVisible();
        await expect(page.getByTestId("source-uri")).toBeVisible();
    });

    test("Submit form successfully", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/create")

        await page.getByLabel("Source URI").fill("/test");
        await page.getByLabel("Series ID", { exact: true }).fill("mock-quarterly");
        await page.getByRole("button", { name: /Create Job/i }).click();

        await page.waitForURL("**/migration/6**");
        await expect(page.url().toString()).toContain("/migration/6");
    });

    test("Show errors on mandatory fields", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/create")

        await page.getByRole("button", { name: /Create Job/i }).click();

        await expect(page.getByText("There was a problem submitting your form")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Source URI is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("ID is required")).toBeVisible();
    });

    test("Does not allow a job to be created with an invalid source ID", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/create")

        await page.getByLabel("Source URI").fill("/test/invalid");
        await page.getByLabel("Series ID", { exact: true }).fill("test-id");
        await page.getByRole("button", { name: /Create Job/i }).click();

        await expect(page.getByText("Source ID is invalid")).toBeVisible();
    });

    test("Does not allow a duplicate job already running to be submitted.", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/create")

        await page.getByLabel("Source URI").fill("/test");
        await page.getByLabel("Series ID", { exact: true }).fill("duplicate-id");
        await page.getByRole("button", { name: /Create Job/i }).click();

        await expect(page.getByText("Job already running")).toBeVisible();
    });
});