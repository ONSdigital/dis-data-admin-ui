import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Create edition page", () => {
    test("Renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/create");
        await expect(page.getByTestId("page-heading-title")).toContainText("Create new edition");
        await expect(page.getByTestId("mandatory-fields-panel")).toContainText("You must fill in all fields unless marked optional");
        await expect(page.getByTestId("edition-id")).toBeVisible();
        await expect(page.getByTestId("fieldset-quality-designation-radios")).toBeVisible();
        await expect(page.getByTestId("usage-notes-input-0")).toBeVisible();
        await expect(page.getByTestId("usage-notes-textarea-0")).toBeVisible();
        await expect(page.getByTestId("alerts-textarea-0")).toBeVisible();
        await expect(page.getByTestId("dataset-upload-input")).toBeVisible();
    });

    test("Submits form successfully", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/create");
        await page.getByTestId("edition-id").fill("test-edition");
        await page.getByTestId("edition-title").fill("Test title");
        await page.getByTestId("release-date-day").fill("1");
        await page.getByTestId("release-date-month").fill("1");
        await page.getByTestId("release-date-year").fill("2020");
        await page.getByTestId("release-date-hour").fill("9");
        await page.getByTestId("release-date-minutes").fill("30");
        await page.getByTestId("quality-designation-radios-item-accredited-official-input").click();
        await page.getByTestId("usage-notes-input-0").fill("Test usage notes");
        await page.getByTestId("usage-notes-textarea-0").fill("Something about usage notes");
        await page.getByTestId("usage-notes-add-button").click();
        await page.getByTestId("usage-notes-input-1").fill("Another test usage notes");
        await page.getByTestId("usage-notes-textarea-1").fill("Another something about usage notes");
        await page.getByTestId("alerts-radios-0-item-alerts-radios-0-correction-input").click();
        await page.getByTestId("alerts-textarea-0").fill("Something about a correction");
        await page.getByTestId("alerts-add-button").click();
        await page.getByTestId("alerts-radios-1-item-alerts-radios-1-notice-input").click();
        await page.getByTestId("alerts-textarea-1").fill("Something about an alert");
        await page.getByTestId("dataset-upload-value").evaluate(element => { element.value = JSON.stringify([{download_url: "test/file.csv"}, {download_url: "foo/bar.csv"}]); });

        await page.getByRole("button", { name: /Create edition/i }).click();

        await page.waitForURL("**/series/mock-quarterly/editions/test-edition**");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/test-edition");

        // check success message is shown
        await expect(page.getByText("Dataset edition saved")).toBeVisible();

        // check body content loads correctly
        await expect(page.locator("#edition-id")).toContainText("test-edition");
        await expect(page.locator("#edition-title")).toContainText("Test edition");
    });

    test("Show errors on mandatory fields", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/create");

        await page.getByRole("button", { name: /Create edition/i }).click();

        await expect(page.getByText("There was a problem creating this dataset edition")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Edition ID is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Edition title is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Quality designation is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("File upload is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("A release time and date is required")).toBeVisible();

        await expect(page.getByTestId("field-edition-id-error").getByText("Edition ID is required")).toBeVisible();
        await expect(page.getByTestId("field-edition-title-error").getByText("Edition title is required")).toBeVisible();  
        await expect(page.getByTestId("fieldset-quality-designation-radios-error").getByText("Quality designation is required")).toBeVisible();
        await expect(page.getByTestId("field-dataset-upload-input-error").getByText("File upload is required")).toBeVisible();
    });
});
