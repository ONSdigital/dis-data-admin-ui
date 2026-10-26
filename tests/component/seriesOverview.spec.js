import { test, expect } from "@playwright/test";

import { setValidAuthCookies, setValidAdminAuthCookies } from "../utils/utils";

test.describe("Series overview page", () => {
    test("Renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");

        // page heading
        await expect(page.getByTestId("page-heading-title")).toContainText("Mock Dataset");
        await expect(page.getByTestId("page-heading-subtitle")).toContainText("Series");
        await expect(page.getByTestId("page-heading-create-button")).toContainText("Create new edition");
        await expect(page.getByTestId("page-heading-link")).toContainText("Back to dataset series list");

        // editions list
        await expect(page.getByTestId("published-editions-list").getByRole("link", { name: "Timeseries" })).toBeVisible();

        // body content
        await expect(page.locator("#series-id")).toContainText("mock-quarterly");
        await expect(page.locator("#type")).toContainText("static");
        await expect(page.locator("#title")).toContainText("Mock Dataset");
        await expect(page.getByTestId("action-link-title")).toBeVisible();
        await expect(page.locator("#description")).toContainText("This is a mock dataset test description");
        await expect(page.getByTestId("action-link-description")).toBeVisible();
        await expect(page.locator("#topics")).toContainText("Business");
        await expect(page.getByTestId("action-link-topics")).toBeVisible();
        await expect(page.locator("#last-updated")).toContainText("1 January 2000");
        await expect(page.locator("#licence")).toContainText("My Licence");
        await expect(page.locator("#next-release")).toContainText("TBC");
        await expect(page.locator("#keywords")).toContainText("mock");
        await expect(page.locator("#keywords")).toContainText("test");
        await expect(page.locator("#qmi")).toContainText("https://www.ons.gov.uk");
        await expect(page.locator("#publisher")).toContainText("ONS");
        await expect(page.locator("#contacts")).toContainText("First Contact");
        await expect(page.locator("#contacts")).toContainText("Second Contact");
    });

    test("Shows separate unpublished and published edition lists", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");

        await expect(page.getByRole("heading", { name: "Unpublished editions" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Published editions", exact: true })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Available editions" })).not.toBeVisible();

        const unpublished = page.getByTestId("unpublished-editions-list");
        const published = page.getByTestId("published-editions-list");

        await expect(unpublished.getByRole("link", { name: "Time Series Unpublished" })).toBeVisible();
        await expect(unpublished.getByRole("link", { name: "Timeseries" })).not.toBeVisible();
        await expect(published.getByRole("link", { name: "Timeseries" })).toBeVisible();
        await expect(published.getByRole("link", { name: "Time Series Unpublished" })).not.toBeVisible();
        await expect(page.getByTestId("available-editions-list")).not.toBeVisible();
    });

    test("Routes to the edition overview from the published list", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");
        await page.getByTestId("published-editions-list").getByRole("link", { name: "Timeseries" }).click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series");
    });

    test("Shows one available editions list when only unpublished editions exist", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/only-unpublished");

        const available = page.getByTestId("available-editions-list");
        await expect(page.getByRole("heading", { name: "Available editions" })).toBeVisible();
        await expect(available.getByRole("link", { name: "Time Series Unpublished" })).toBeVisible();
        await expect(page.getByTestId("unpublished-editions-list")).not.toBeVisible();
        await expect(page.getByTestId("published-editions-list")).not.toBeVisible();
    });

    test("Shows one available editions list when only published editions exist", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/only-published");

        await expect(page.getByTestId("available-editions-list").getByRole("link", { name: "Timeseries" })).toBeVisible();
        await expect(page.getByTestId("unpublished-editions-list")).not.toBeVisible();
        await expect(page.getByTestId("published-editions-list")).not.toBeVisible();
    });

    test("Shows an empty available editions list when both calls succeed with no items", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/no-editions");

        await expect(page.getByRole("heading", { name: "Available editions" })).toBeVisible();
        await expect(page.getByText("There are no available editions for this series")).toBeVisible();
        await expect(page.getByTestId("available-editions-list")).not.toBeVisible();
    });

    test("Shows an editions error when both edition requests fail", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/editions-both-fail");

        await expect(page.getByText("There was an issue retrieving the list of editions for this dataset. Try refreshing the page.")).toBeVisible();
        await expect(page.getByTestId("available-editions-list")).not.toBeVisible();
        await expect(page.getByTestId("unpublished-editions-list")).not.toBeVisible();
        await expect(page.getByTestId("published-editions-list")).not.toBeVisible();
        await expect(page.getByTestId("page-heading-title")).toBeVisible();
    });

    test("Still shows available editions when only the published request fails", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/published-editions-fail");

        await expect(page.getByTestId("available-editions-list").getByRole("link", { name: "Time Series Unpublished" })).toBeVisible();
        await expect(page.getByText("There was an issue retrieving the list of editions for this dataset. Try refreshing the page.")).not.toBeVisible();
    });

    test("Handles a dataset series response error", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/test-series-that-doesnt-exist");
        await expect(page.getByTestId("dataset-series-response-error")).toContainText("There was an issue retrieving the data for this page. Try refreshing the page.");
    });

    test("Page heading create button routes to create new edition page", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");
        await page.getByTestId("page-heading-create-button").click();
        await page.waitForURL("**/series/mock-quarterly/editions/create");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/create");
    });

    test("Page heading 'back to' link routes to series list page", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");
        await page.getByTestId("page-heading-link").click();
        await page.waitForURL("**/series");
        await expect(page.url().toString()).toContain("series");
    });

    test("Shows series delete button when dataset is unpublished", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-minimal");
        await expect(page.getByTestId("delete-series-button")).toBeVisible();
    });

    test("Does not show series delete button when dataset is published", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");
        await expect(page.getByTestId("delete-series-button")).not.toBeVisible();
    });

    test("Does not show publish message when no difference between current and next", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");
        await expect(page.getByTestId("page-heading-publish-button")).not.toBeVisible();
        await expect(page.getByTestId("page-heading-publish-panel")).not.toBeVisible();
    });

    test("Shows publish message when no difference between current and next", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/test-publish-message-dataset");
        await expect(page.getByTestId("page-heading-publish-panel")).toBeVisible();
        await expect(page.getByTestId("page-heading-publish-button")).not.toBeVisible();
    });

    test("Shows publish message and button when user is admin", async ({ page, context }) => {
        setValidAdminAuthCookies(context);

        await page.goto("./series/test-publish-message-dataset");
        await expect(page.getByTestId("page-heading-publish-panel")).toBeVisible();
        await expect(page.getByTestId("page-heading-publish-button")).toBeVisible();
    });

    test.describe("Handles API error", () => {
        test("When 404 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/404");
            await expect(page.getByText("There was an issue retrieving the data for this page. Try refreshing the page.")).toBeVisible();
        });

        test("When 500 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./series/500");
            await expect(page.getByText("There was an issue retrieving the data for this page. Try refreshing the page.")).toBeVisible();
        });
    });
});
