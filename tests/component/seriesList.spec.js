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
        await expect(page.getByText('Page 1 of')).toBeVisible();
        
        await page.getByText("Next").click();
        await expect(page.getByText('Page 2 of')).toBeVisible();
        await expect(page.getByRole("link", { name: "Consumer prices" })).not.toBeVisible();
        await expect(page.getByRole("link", { name: "Lorem ipsum dolor sit amet 26" })).toBeVisible();
        
        await page.getByText("Previous").click();
        await expect(page.getByText('Page 1 of')).toBeVisible();
        await expect(page.getByRole("link", { name: "Consumer prices" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Lorem ipsum dolor sit amet 26" })).not.toBeVisible();
        
        await page.getByRole('link', { name: 'Go to the last page (Page 5)' }).click();
        await expect(page.getByText('Page 5 of')).toBeVisible();
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
        await expect(page.getByTestId("type-field")).toContainText("static");
        await expect(page.getByTestId("title-field")).toContainText("Mock Dataset");
        await expect(page.getByTestId("description-field")).toContainText("This is a mock dataset test description");
        await expect(page.getByTestId("topics-field")).toBeVisible();
        await expect(page.getByTestId("topics-field")).toContainText("Business, industry and trade");
        await expect(page.getByTestId("topics-field")).toContainText("Census");
        await expect(page.getByTestId("last-updated-field")).toContainText("1 January 2000");
        await expect(page.getByTestId("license-field")).toContainText("My License");
        await expect(page.getByTestId("next-release-field")).toContainText("TBC");
        await expect(page.getByTestId("keywords-field")).toBeVisible();
        await expect(page.getByTestId("keywords-field")).toContainText("mock");
        await expect(page.getByTestId("keywords-field")).toContainText("test");
        await expect(page.getByTestId("qmi-field")).toContainText("https://www.ons.gov.uk");
        await expect(page.getByTestId("contacts-field")).toBeVisible();
        await expect(page.getByTestId("contact-name-field-0")).toContainText("First Contact");
        await expect(page.getByTestId("contact-email-field-0")).toHaveAttribute("href", "mailto:contactOne@ons.gov.uk");
        await expect(page.getByTestId("contact-telephone-field-0")).toHaveAttribute("href", "tel:+44 1234 567891");
        await expect(page.getByTestId("contact-name-field-1")).toContainText("Second Contact");
        await expect(page.getByTestId("contact-email-field-1")).toHaveAttribute("href", "mailto:contactTwo@ons.gov.uk")
        await expect(page.getByTestId("contact-telephone-field-1")).toHaveAttribute("href", "tel:+44 1234 567892");
        await expect(page.getByTestId("publisher-name-field")).toContainText("ONS");
        await expect(page.getByTestId("publisher-href-field")).toContainText("https://www.ons.gov.uk");
    });

    test("Choose a minimally populated dataset from a list of datasets and route to chosen dataset page", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series")
        await page.getByRole("link", { name: "Minimal Mock Dataset" }).click();
        await expect(page.getByText("mock-minimal")).toBeVisible();
        await expect(page.getByText("Available editions")).toBeVisible();
        await page.waitForURL("**/series/mock-minimal");
        await expect(page.url().toString()).toContain("series/mock-minimal");
        await expect(page.getByTestId("id-field")).toContainText("mock-minimal");
        await expect(page.getByTestId("type-field")).toContainText("static");
        await expect(page.getByTestId("title-field")).toContainText("Minimal Mock Dataset");
        await expect(page.getByTestId("description-field")).toContainText("This is a minimal mock dataset test description");
        await expect(page.getByTestId("topics-field")).toBeVisible();
        await expect(page.getByTestId("topics-field")).toContainText("Business, industry and trade");
        await expect(page.getByTestId("topics-field")).toContainText("1003 - unable to find topic title");
        await expect(page.getByTestId("last-updated-field")).toContainText("missing date");
        await expect(page.getByTestId("license-field")).toContainText("My Minimal License");
        await expect(page.getByTestId("next-release-field")).not.toBeVisible();
        await expect(page.getByTestId("keywords-field")).not.toBeVisible();
        await expect(page.getByTestId("qmi-field")).not.toBeVisible();
        await expect(page.getByTestId("contacts-field")).toBeVisible();
        await expect(page.getByTestId("contact-name-field-0")).toContainText("First Contact");
        await expect(page.getByTestId("contact-email-field-0")).toHaveAttribute("href", "mailto:contactOne@ons.gov.uk");
        await expect(page.getByTestId("contact-telephone-field-0")).not.toBeVisible();
        await expect(page.getByTestId("publisher-name-field")).not.toBeVisible();
        await expect(page.getByTestId("publisher-href-field")).not.toBeVisible();
    });
});