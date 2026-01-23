import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Series publish page", () => {
    test.describe("renders as expected when", () => {
        test("A series is publishable", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/test-publish-message-dataset/publish");

            await expect(page.getByTestId("dataset-series-publish-heading")).toContainText("Are you sure you want to publish \"Test associated\"?");
            await expect(page.getByTestId("dataset-series-publish-p")).toContainText("Approving this action will make the dataset series visible to the public.");
            await expect(page.getByTestId("dataset-series-publish-button")).toBeVisible();
            await expect(page.getByTestId("dataset-series-publish-cancel-link")).toBeVisible();
        });

        test("A series is not publishable", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/mock-quarterly/publish");

            await expect(page.getByTestId("dataset-series-not-publishable")).toContainText("There doesn't appear to be any changes to this series that are publishable.");
            await expect(page.getByTestId("dataset-series-publish-button")).not.toBeVisible();
        });

        test("GET request to series end point fails", async ({ page, context }) => {
            setValidAuthCookies(context);

            await page.goto("./series/404/publish");

            await expect(page.getByTestId("dataset-series-response-error")).toContainText("There was an issue retrieving the data for this page. Try refreshing the page.");
            await expect(page.getByTestId("dataset-series-publish-button")).not.toBeVisible();
        });
    });

    test("Submits form, publishes series and redirects user to series overview page", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/test-publish-message-dataset/publish");
        await page.getByTestId("dataset-series-publish-button").click();

        await page.waitForURL("**/series/test-publish-message-dataset**");

        await expect(page.url().toString()).toContain("/series/test-publish-message-dataset");
        await expect(page.getByText("Dataset series published.")).toBeVisible();
    });

    test("Cancel link returns user to series overview page", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/test-publish-message-dataset/publish");
        await page.getByTestId("dataset-series-publish-cancel-link").click();

        await page.waitForURL("**/series/test-publish-message-dataset**");
        await expect(page.url().toString()).toContain("/series/test-publish-message-dataset");
    });
});