import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Create version page", () => {
    test("Renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/1/edit");
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Edit version 1");

        
        await expect(page.getByTestId("fieldset-quality-designation-radios")).toBeVisible();
        await expect(page.getByTestId("usage-notes-input-0")).toBeVisible();
        await expect(page.getByTestId("usage-notes-textarea-0")).toBeVisible();
        await expect(page.getByTestId("fieldset-alerts-radios-0")).toBeVisible();
        await expect(page.getByTestId("alerts-textarea-0")).toBeVisible();
    });

    test("Submits form successfully", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/1/edit");
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

        await page.getByRole("button", { name: /Save version/i }).click();

        await page.waitForURL("**/series/mock-quarterly/editions/time-series/versions/1**");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/1");

        await expect(page.getByText("Dataset version saved")).toBeVisible();
    });
});
