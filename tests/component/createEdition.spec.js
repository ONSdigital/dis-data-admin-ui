import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Create edition page", () => {
    test("Renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/create");
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Create a new dataset edition for mock-quarterly");

        await expect(page.getByTestId("edition-id")).toBeVisible();
        await expect(page.getByTestId("select-quality-desingation")).toBeVisible();
        await expect(page.getByTestId("usage-notes-input-0")).toBeVisible();
        await expect(page.getByTestId("usage-notes-textarea-0")).toBeVisible();
        await expect(page.getByTestId("select-alerts-select-0")).toBeVisible();
        await expect(page.getByTestId("alerts-textarea-0")).toBeVisible();
        await expect(page.getByTestId("dataset-upload-input")).toBeVisible();
    });

    test("Route back to dataset overview page works", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/create");
        await page.getByRole("link", { name: "Back to mock-quarterly dataset series overview" }).click();
        await page.waitForURL("**/series/mock-quarterly");
        await expect(page.url().toString()).toContain("series/mock-quarterly");
    });

    test("Submits form successfully", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/create");
        await page.getByTestId("edition-id").fill("test-id");
        await page.getByTestId("select-quality-desingation").selectOption("official");
        await page.getByTestId("usage-notes-input-0").fill("Test usage notes");
        await page.getByTestId("usage-notes-textarea-0").fill("Something about usage notes");
        await page.getByTestId("select-alerts-select-0").selectOption("correction");
        await page.getByTestId("alerts-textarea-0").fill("Something about a correction");
        await page.getByTestId("dataset-upload-value").evaluate(element => { element.value = JSON.stringify({download_url: "test/file.csv"}); });

        await page.getByRole("button", { name: /Save new dataset edition/i }).click();

        await expect(page.getByText('Dataset edition "test-id" created successfully. View new edition.')).toBeVisible();
    });

    test("Show errors on mandatory fields", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/create");

        await page.getByRole("button", { name: /Save new dataset edition/i }).click();

        await expect(page.getByText("There was a problem creating this dataset edition")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Title is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Quality designation is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("File upload is required")).toBeVisible();

        await expect(page.getByTestId("field-edition-id-error").getByText("Title is required")).toBeVisible();
        await expect(page.getByTestId("quality-desingation-error").getByText("Quality designation is required")).toBeVisible();
        await expect(page.getByTestId("field-dataset-upload-input-error").getByText("File upload is required")).toBeVisible();
    });
});
