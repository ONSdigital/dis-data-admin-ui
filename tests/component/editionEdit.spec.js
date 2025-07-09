import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Edit edition page", () => {
    test("Renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/edit");
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Edit edition: Timeseries");

        await expect(page.getByTestId("edition-id")).toBeVisible();
        await expect(page.getByTestId("edition-title")).toBeVisible();
        await expect(page.getByTestId("edition-save-button")).toBeVisible();
    });

    test("Submits form successfully", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/edit");
        await page.getByTestId("edition-id").fill("test-id");
        await page.getByTestId("edition-title").fill("Test title");


        await page.getByRole("button", { name: /Save dataset edition/i }).click();

        await page.waitForURL("**/series/mock-quarterly/editions/test-id**");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/test-id");

        await expect(page.getByText("Dataset edition saved")).toBeVisible();
    });

    test("Show errors on mandatory fields", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/edit");

        await page.getByTestId("edition-id").fill("");
        await page.getByTestId("edition-title").fill("");

        await page.getByRole("button", { name: /Save dataset edition/i }).click();

        await expect(page.getByText("There was a problem creating this dataset edition")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Edition ID is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Edition title is required")).toBeVisible();
    });
});
