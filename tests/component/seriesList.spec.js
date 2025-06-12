import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Series list page", () => {
    test("Renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series")
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Dataset series");
        await expect(page.getByRole("link", { name: "Weekly deaths" })).toBeVisible();
    });

    test("Route from Series page to Create Dataset page", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series")
        await page.getByRole("link", { name: "Add new dataset series" }).click();
        await page.waitForURL("**/series/create");
        await expect(page.url().toString()).toContain("series/create");
    });

    test("Choose a fully populated dataset from a list of datasets and route to chosen dataset page", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series")
        await page.getByRole("link", { name: "Mock Dataset", exact: true }).click();
        await expect(page.getByText("mock-quarterly")).toBeVisible();
        await expect(page.getByText("Available editions")).toBeVisible();
        await page.waitForURL("**/series/mock-quarterly");
        await expect(page.url().toString()).toContain("series/mock-quarterly");
        await expect(page.getByTestId("id-field")).toContainText("mock-quarterly");
    });
});