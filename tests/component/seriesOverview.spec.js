import { test, expect } from "@playwright/test";

import { addValidAuthCookies } from "../utils/utils";

test.describe("Series overview page", () => {
    test("renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Series");
        await expect(page.getByRole("link", { name: "time-series" })).toBeVisible();
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

    test("a minimally populated dataset renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-minimal");
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

    test("routes to create new edition page", async ({ page, context }) => {
        addValidAuthCookies(context);
        
        await page.goto("./series/mock-quarterly");
        await page.getByRole("button", { name: "Create new edition" }).click();
        await page.waitForURL("**/series/mock-quarterly/editions/create");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/create");
    });

    test("routes to edition overview page when selecting edition from list", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto("./series/mock-quarterly");
        await page.getByRole("link", { name: "time-series" }).click();
        await page.waitForURL("**/series/mock-quarterly/editions/time-series");
        await expect(page.url().toString()).toContain("series/mock-quarterly/editions/time-series");
    });
});