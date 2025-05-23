import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Edit series page", () => {
    test("Route from dataset series id page to edit page", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series")
        await page.getByRole("link", { name: "Mock Dataset", exact: true}).click();
        await page.waitForURL("**/series/mock-quarterly");
        await page.getByRole("link", { name: "Edit Metadata" }).click();
        await page.waitForURL("**/series/mock-quarterly/edit");

        await expect(page.url().toString()).toContain("series/mock-quarterly/edit");
    });

    test("Submit form successfully", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/edit")

        await page.getByTestId("dataset-series-title").fill("test edit title");
        await page.getByLabel("Topics").selectOption("1001");
        await page.getByRole("button", { name: /Add Topic/i }).click();
        await page.getByTestId("field-dataset-series-description").getByRole("textbox").fill("test edit description");
        await page.getByLabel("Name").fill("test edit name");
        await page.getByLabel("Email").fill("test-email-edit@test.com");
        await page.getByRole("button", { name: /Add contact/i }).click();
        await page.getByRole("button", { name: /Save new dataset series/i }).click();

        await expect(page.getByText("Dataset series saved")).toBeVisible();
    });

    test("Does not allow duplicate dataset series title to be created", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/edit")

        await page.getByTestId("dataset-series-title").fill("duplicate-title");
        await page.getByRole("button", { name: /Save new dataset series/i }).click();

        await expect(page.getByText("A dataset series titled duplicate-title already exists")).toBeVisible();
    });
});