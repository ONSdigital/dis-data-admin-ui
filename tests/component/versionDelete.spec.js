import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Version delete page", () => {
    test("renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/1/delete");
        await expect(page.getByTestId("page-heading-title")).toHaveText("Delete version");
        await expect(page.getByTestId("page-heading-subtitle")).toHaveText("mock-quarterly: time-series - Version 1");
        await expect(page.getByTestId("fieldset-confirm-delete-legend")).toHaveText("Are you sure you want to delete this item? (mock-quarterly: time-series - Version 1)");
        await expect(page.getByTestId("confirm-delete-item-yes-input")).toBeVisible();
        await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
    });

    test("submits form successfully", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/1/delete");
        await page.getByTestId("confirm-delete-item-yes-input").click();
        await page.getByRole("button", { name: "Delete" }).click();

        await page.waitForURL("**/series?display_delete_success=true");
        await expect(page.getByTestId("success-panel")).toContainText("Item deleted");
    });

    test("shows validation error when submitting form without clicking checkbox", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/1/delete");
        await page.getByRole("button", { name: "Delete" }).click();

        await expect(page.getByTestId("fieldset-confirm-delete-error")).toContainText("You must confirm deletion.");
    });

    test("shows API error when API request fails", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly/editions/time-series/versions/return-internal-server-error/delete");
        await page.getByTestId("confirm-delete-item-yes-input").click();
        await page.getByRole("button", { name: "Delete" }).click();

        await expect(page.getByTestId("delete-error")).toContainText("There was a problem deleting");
        await expect(page.getByTestId("delete-error")).toContainText("An error occurred while trying to delete.");

        await expect(page.getByTestId("confirm-delete-item-yes-input")).not.toBeChecked();
    });
});