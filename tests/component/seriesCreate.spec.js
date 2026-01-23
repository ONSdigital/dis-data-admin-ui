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
        await expect(page.getByTestId("fieldset-dataset-series-topics-checkbox")).toBeVisible();
        await expect(page.getByTestId("dataset-series-description")).toBeVisible();
        await expect(page.getByTestId("dataset-series-qmi")).toBeVisible();
        await expect(page.getByTestId("dataset-series-keywords")).toBeVisible();
        await expect(page.getByTestId("dataset-series-contact-name")).toBeVisible();
        await expect(page.getByTestId("dataset-series-contact-email")).toBeVisible();
    });

    test("Submit form successfully", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./series/create")
        await page.getByLabel("Title").fill("test title");
        await page.getByLabel("Series ID", {exact: true}).fill("mock-quarterly");
        await page.getByTestId('dataset-series-topics-checkbox-item-business-industry-and-trade-input').click()
        await page.getByTestId("field-dataset-series-description").getByRole("textbox").fill("test description");
        await page.getByTestId("dataset-series-qmi").fill("test-url.com");
        await page.getByTestId("dataset-series-keywords").fill("test,keywords,foo,bar");
        await page.getByLabel("Name").fill("test name");
        await page.getByLabel("Email").fill("test-email@test.com");
        await page.getByRole("button", { name: /Add contact/i }).click();
        await page.getByRole("button", { name: /Create dataset series/i }).click();
        
        await page.waitForURL("**/series/mock-quarterly**");

        await expect(page.url().toString()).toContain("/series/mock-quarterly");
        await expect(page.getByText("Dataset series saved")).toBeVisible();
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
        await page.getByTestId('dataset-series-topics-checkbox-item-business-industry-and-trade-input').click()
        await page.getByTestId("field-dataset-series-description").getByRole("textbox").fill("test description");
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
        await page.getByTestId('dataset-series-topics-checkbox-item-business-industry-and-trade-input').click()
        await page.getByTestId("field-dataset-series-description").getByRole("textbox").fill("test description");
        await page.getByTestId("dataset-series-qmi").fill("test-url.com");
        await page.getByTestId("dataset-series-keywords").fill("test,keywords,foo,bar");
        await page.getByLabel("Name").fill("test name");
        await page.getByLabel("Email").fill("test@email.com");
        await page.getByRole("button", { name: /Add contact/i }).click();
        await page.getByRole("button", { name: /Create dataset series/i }).click();

        await expect(page.getByText("A dataset series titled duplicate-title already exists")).toBeVisible();
    });
});