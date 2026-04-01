import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Create series page", () => {
    test("Renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/create")
        await expect(page.getByTestId("page-heading-title")).toContainText("Create new dataset series");
        await expect(page.getByTestId("mandatory-fields-panel")).toContainText("You must fill in all fields unless marked optional");
        await expect(page.getByTestId("dataset-series-id")).toBeVisible();
        await expect(page.getByTestId("dataset-series-title")).toBeVisible();
        await expect(page.getByTestId("topics-selector-accordion-accordion-item-1000")).toBeVisible();
        await expect(page.getByTestId("topics-selector-accordion-accordion-item-1000")).toContainText("Business");
        await expect(page.getByTestId("topics-selector-accordion-accordion-item-2000")).toBeVisible();
        await expect(page.getByTestId("topics-selector-accordion-accordion-item-2000")).toContainText("Census");
        await expect(page.getByTestId("topics-summary-no-data")).toContainText("No topic selected");
        await expect(page.getByTestId("dataset-series-description")).toBeVisible();
        await expect(page.getByTestId("dataset-series-qmi")).toBeVisible();
        await expect(page.getByTestId("dataset-series-keywords")).toBeVisible();
        await expect(page.getByTestId("dataset-series-contact-name")).toBeVisible();
        await expect(page.getByTestId("dataset-series-contact-email")).toBeVisible();
    });

    test("Submit form successfully", async ({ page, context }) => {
        await setValidAuthCookies(context);

        await page.goto("./series/create")
        await page.getByLabel("Title").fill("test title");
        await page.getByLabel("Series ID", {exact: true}).fill("mock-quarterly");
        await page.getByTestId("topics-selector-accordion-accordion-item-1000").getByRole("button").click();
        await page.getByTestId("dataset-series-topic-1001-checkbox").getByRole("checkbox").check();
        
        await page.getByTestId("field-dataset-series-description").getByRole("textbox").fill("test description");
        await page.getByTestId("dataset-series-qmi").fill("test-url.com");
        await page.getByTestId("dataset-series-keywords").fill("test,keywords,foo,bar");
        await page.getByLabel("Name").fill("test name");
        await page.getByLabel("Email").fill("test-email@test.com");
        await page.getByRole("button", { name: /Add contact/i }).click();
        await page.getByRole("button", { name: /Create dataset series/i }).click();
        
        await page.waitForURL("**/series/mock-quarterly**");

        await expect(page.url().toString()).toContain("/series/mock-quarterly");

        // check success message is shown
        await expect(page.getByText("Dataset series saved")).toBeVisible();

        // check body content loads correctly
        await expect(page.locator("#series-id")).toContainText("mock-quarterly");
        await expect(page.locator("#type")).toContainText("static");
        await expect(page.locator("#title")).toContainText("Mock Dataset");
    });

    test("Show errors on mandatory fields", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/create")

        await page.getByRole("button", { name: /Create dataset series/i }).click();

        await expect(page.getByText("There was a problem submitting your form")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Title is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("ID is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Description is required")).toBeVisible();
        await expect(page.getByLabel("There was a problem").getByText("Contact is required")).toBeVisible();

        await expect(page.getByTestId("field-dataset-series-title-error").getByText("Title is required")).toBeVisible();
        await expect(page.getByTestId("field-dataset-series-id-error").getByText("ID is required")).toBeVisible();
        await expect(page.getByTestId("field-dataset-series-description-error").getByText("Description is required")).toBeVisible();
        await expect(page.getByTestId("field-dataset-series-contacts-error").getByText("Contact is required")).toBeVisible();
    });

    test("Show error on invalid email", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/create")

        await page.getByLabel("Email").fill("test-email");
        await page.getByRole("button", { name: /Add contact/i }).click();
        await expect(page.getByTestId("field-dataset-series-contact-email-error").getByText("Invalid email")).toBeVisible();
    });

    test("Does not allow duplicate dataset series to be created", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/create")
        await page.getByLabel("Title").fill("test title");
        await page.getByLabel("Series ID", {exact: true}).fill("duplicate-id");
        await page.getByTestId("field-dataset-series-description").getByRole("textbox").fill("test description");
        await page.getByTestId("topics-selector-accordion-accordion-item-1000").getByRole("button").click();
        await page.getByTestId("dataset-series-topic-1001-checkbox").getByRole("checkbox").check();
        await page.getByTestId("dataset-series-qmi").fill("test-url.com");
        await page.getByTestId("dataset-series-keywords").fill("test,keywords,foo,bar");
        await page.getByLabel("Name").fill("test name");
        await page.getByLabel("Email").fill("tes-email@test.com");
        await page.getByRole("button", { name: /Add contact/i }).click();
        await page.getByRole("button", { name: /Create dataset series/i }).click();

        await expect(page.getByText("A dataset series with an ID of duplicate-id already exists")).toBeVisible();
    });

    test("Does not allow duplicate dataset series title to be created", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/create")
        await page.getByLabel("Title").fill("duplicate-title");
        await page.getByLabel("Series ID", {exact: true}).fill("test ID");
        await page.getByTestId("field-dataset-series-description").getByRole("textbox").fill("test description");
        await page.getByTestId("topics-selector-accordion-accordion-item-1000").getByRole("button").click();
        await page.getByTestId("dataset-series-topic-1001-checkbox").getByRole("checkbox").check();
        await page.getByTestId("dataset-series-qmi").fill("test-url.com");
        await page.getByTestId("dataset-series-keywords").fill("test,keywords,foo,bar");
        await page.getByLabel("Name").fill("test name");
        await page.getByLabel("Email").fill("test@email.com");
        await page.getByRole("button", { name: /Add contact/i }).click();
        await page.getByRole("button", { name: /Create dataset series/i }).click();

        await expect(page.getByText("A dataset series titled duplicate-title already exists")).toBeVisible();
    });
});