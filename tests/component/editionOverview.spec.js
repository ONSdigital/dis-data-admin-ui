import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Edition overview page", () => {
    test("renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series");
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Mock Dataset: Timeseries");
        await expect(page.getByRole("link", { name: "Version: 1" })).toBeVisible();
        await expect(page.getByTestId("id-field")).toContainText("time-series");
        await expect(page.getByTestId("title-field")).toContainText("Timeseries");
        await expect(page.getByTestId("release-date-field")).toContainText("26 January 2025");
    });

    test("routes to create new edition page", async ({ page, context }) => {
        addValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series");
        await page.getByRole("link", { name: "Add new dataset version" }).click();
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/create?edition_title=Timeseries");
    });

    test("routes to create new edition page with unpublished version", async ({ page, context }) => {
        addValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series-unpublished");
        await expect(page.getByText("Unpublished version exists, cannot add new dataset version.")).toBeVisible();
    });

    test("routes to version overview page when selecting version from list", async ({ page, context }) => {
        addValidAuthCookies(context);
        await page.goto("./series/mock-quarterly/editions/time-series");
        await page.getByRole("link", { name: "Version: 1" }).click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series/versions/1");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series/versions/1");
    });
});