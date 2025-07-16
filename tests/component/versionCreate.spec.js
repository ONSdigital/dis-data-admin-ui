import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Create version page", () => {
    test("Renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/create");
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Create a new dataset version for mock-quarterly");

        
        await expect(page.getByTestId("select-quality-designation")).toBeVisible();
        await expect(page.getByTestId("usage-notes-input-0")).toBeVisible();
        await expect(page.getByTestId("usage-notes-textarea-0")).toBeVisible();
        await expect(page.getByTestId("select-alerts-select-0")).toBeVisible();
        await expect(page.getByTestId("alerts-textarea-0")).toBeVisible();
        await expect(page.getByTestId("dataset-upload-input")).toBeVisible();
    });

    test("Route back to dataset overview page works", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/create");
        await page.getByRole("link", { name: "Back to time-series dataset edition overview" }).click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series");
    });

    test("Submits form successfully", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/create");
        await page.getByTestId("release-date-day").fill("1");
        await page.getByTestId("release-date-month").fill("1");
        await page.getByTestId("release-date-year").fill("2020");
        await page.getByTestId("release-date-hour").fill("9");
        await page.getByTestId("release-date-minutes").fill("30");
        await page.getByTestId("select-quality-designation").selectOption("official");
        await page.getByTestId("usage-notes-input-0").fill("Test usage notes");
        await page.getByTestId("usage-notes-textarea-0").fill("Something about usage notes");
        await page.getByTestId("usage-notes-add-button").click();
        await page.getByTestId("usage-notes-input-1").fill("Another test usage notes");
        await page.getByTestId("usage-notes-textarea-1").fill("Another something about usage notes");
        await page.getByTestId("select-alerts-select-0").selectOption("correction");
        await page.getByTestId("alerts-textarea-0").fill("Something about a correction");
        await page.getByTestId("alerts-add-button").click();
        await page.getByTestId("select-alerts-select-1").selectOption("alert");
        await page.getByTestId("alerts-textarea-1").fill("Something about an alert");
        await page.getByTestId("dataset-upload-value").evaluate(element => { element.value = JSON.stringify({download_url: "test/file.csv"}); });

        await page.getByRole("button", { name: /Save new dataset version/i }).click();

        await page.waitForURL("**/series/mock-quarterly/editions/time-series/versions/1**");

        await expect(page.url().toString()).toContain("/series/mock-quarterly/editions/time-series/versions/1");
        await expect(page.getByText("Dataset version saved")).toBeVisible();
    });

    test("Show errors on mandatory fields", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/create");

        await page.getByRole("button", { name: /Save new dataset version/i }).click();

        await expect(page.getByText("There was a problem creating this dataset version")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Quality designation is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("File upload is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("A release time and date is required")).toBeVisible();

        await expect(page.getByTestId("quality-designation-error").getByText("Quality designation is required")).toBeVisible();
        await expect(page.getByTestId("field-dataset-upload-input-error").getByText("File upload is required")).toBeVisible();
    });
});
