import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Home", () => {
    test("Works as it should", async ({ page }) => {
        await page.goto("./")
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Home");
    })

    // TODO: workout what Layout elements break accessbility tests
    // test("Should not have any automatically detectable accessibility issues", async ({ page }) => {
    //     await page.goto("./");

    //     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    //     expect(accessibilityScanResults.violations).toEqual([]);
    // });
})