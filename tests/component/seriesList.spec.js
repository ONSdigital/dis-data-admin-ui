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

    test("Traverse through pagination", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series")
        await expect(page.getByRole("link", { name: "Consumer prices" })).toBeVisible();
        await expect(page.getByText("Page 1 of")).toBeVisible();
        
        await page.getByText("Next").click();
        await expect(page.getByText("Page 2 of")).toBeVisible();
        await expect(page.getByRole("link", { name: "Consumer prices" })).not.toBeVisible();
        await expect(page.getByRole("link", { name: "Lorem ipsum dolor sit amet 26" })).toBeVisible();
        
        await page.getByText("Previous").click();
        await expect(page.getByText("Page 1 of")).toBeVisible();
        await expect(page.getByRole("link", { name: "Consumer prices" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Lorem ipsum dolor sit amet 26" })).not.toBeVisible();
        
        await page.getByRole("link", { name: "Go to the last page (Page 5)" }).click();
        await expect(page.getByText("Page 5 of")).toBeVisible();
        await expect(page.getByRole("link", { name: "Lorem ipsum dolor sit amet 121" })).toBeVisible();
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

test.describe("Filtering on series list page", () => {
    test ("Filtering by a valid ID returns correct results", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series");
        await page.getByTestId("series-list-search-by-id").fill("foo-bar");
        await page.getByTestId("icon-search").click();
        await page.waitForURL("**/series?id=foo-bar");
        await expect(page.getByRole("link", { name: "Foobar test dataset" })).toBeVisible();
    });

    test ("Filtering by non existent ID handles returned 404", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series");
        await page.getByTestId("series-list-search-by-id").fill("bar-foo");
        await page.getByTestId("icon-search").click();
        await page.waitForURL("**/series?id=bar-foo");
        await expect(page.getByText("No results found for bar-foo")).toBeVisible();
    });
})