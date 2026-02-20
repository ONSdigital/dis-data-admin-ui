import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Migration list page", () => {
    test("Renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration")
        await expect(page.getByText("Showing 1 to 5 of 5 jobs")).toBeVisible();
        await expect(page.getByRole("link", { name: "1" })).toBeVisible();
        await expect(page.getByTestId("create-migration-job-button")).toBeVisible();

        // migration list and contents
        await expect(page.getByTestId("migration-list-table")).toBeVisible();
        await expect(page.getByTestId("migration-list-table-cell-0-0")).toContainText("1");
        await expect(page.getByTestId("migration-list-table-cell-0-2")).toContainText("CPIH");
        await expect(page.getByTestId("migration-list-table-cell-0-1")).toContainText("11 June 2020");
        await expect(page.getByTestId("migration-list-table-cell-0-3")).toContainText("In review");
        await expect(page.getByTestId("migration-list-table-cell-1-0")).toContainText("2");
        await expect(page.getByTestId("migration-list-table-cell-1-1")).toContainText("20 April 2020");
        await expect(page.getByTestId("migration-list-table-cell-1-2")).toContainText("Consumer price inflation");
        await expect(page.getByTestId("migration-list-table-cell-1-3")).toContainText("Submitted");
        await expect(page.getByTestId("migration-list-table-cell-2-0")).toContainText("3");
        await expect(page.getByTestId("migration-list-table-cell-2-1")).toContainText("12 August 2020");
        await expect(page.getByTestId("migration-list-table-cell-2-2")).toContainText("Labour market");
        await expect(page.getByTestId("migration-list-table-cell-2-3")).toContainText("Approved");
    });
});