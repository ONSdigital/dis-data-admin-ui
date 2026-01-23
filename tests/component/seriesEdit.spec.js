import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Edit series page", () => {
    test("Route from dataset series id page to edit page", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly")
        //await page.getByRole("link", { name: "Edit" }).click();
        await page.getByTestId("action-link-title").click();
        await page.waitForURL("**/series/mock-quarterly/edit#dataset-series-title");

        await expect(page.url().toString()).toContain("series/mock-quarterly/edit#dataset-series-title");
    });

    test("Submit form successfully", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/edit")

        await page.getByTestId("dataset-series-title").fill("test edit title");
        await page.getByTestId('dataset-series-topics-checkbox-item-business-industry-and-trade-input').click()
        await page.getByTestId("field-dataset-series-description").getByRole("textbox").fill("test edit description");
        await page.getByTestId("dataset-series-qmi").fill("test-url.com");
        await page.getByTestId("dataset-series-keywords").fill("test,keywords,foo,bar");
        await page.getByLabel("Name").fill("test edit name");
        await page.getByLabel("Email").fill("test-email-edit@test.com");
        await page.getByRole("button", { name: /Add contact/i }).click();
        await page.getByRole("button", { name: /Save changes/i }).click();

        await expect(page.getByText("Dataset series saved")).toBeVisible();
    });

    test("Does not allow duplicate dataset series title to be created", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/edit")

        await page.getByTestId("dataset-series-title").fill("duplicate-title");
        await page.getByRole("button", { name: /Save changes/i }).click();

        await expect(page.getByText("A dataset series titled duplicate-title already exists")).toBeVisible();
    });
});