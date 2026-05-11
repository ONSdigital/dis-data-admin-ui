import { test, expect } from "@playwright/test";

import { setValidAuthCookies } from "../utils/utils";

test.describe("Migration overview page", () => {
    test("Breadcrumb renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/1")
        await expect(page.getByTestId("breadcrumb-base-link-0")).toBeVisible();
        await expect(page.getByTestId("breadcrumb-base-link-0")).toHaveText("Migration");
        expect(await page.getByTestId("breadcrumb-base-link-0").getAttribute("href")).toBe("/data-admin/migration");
    });

    test("Page header renders as expected", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/1")
        await expect(page.getByTestId("page-heading-subtitle")).toHaveText("Series");
        await expect(page.getByTestId("page-heading-title")).toHaveText("CPIH");
        await expect(page.getByTestId("page-heading-link")).toBeVisible();
        await expect(page.getByTestId("page-heading-link")).toHaveText("Back to migration jobs list");
    });

    test("Renders as expected when job state is in 'submitted' or 'migrating'", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/2")
        await expect(page.getByText("Dataset series migration is still in progress. Try refreshing the page")).toBeVisible();
        await expect(page.getByTestId("migration-job-overview-list")).not.toBeVisible();
    });

    test("Renders as expected when job state in 'in_review' or further", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/1")
        await expect(page.getByText("Dataset series migration is still in progress. Try refreshing the page")).not.toBeVisible();
        //await page.waitForTimeout(60000);

        // body/summary content
        await expect(page.getByTestId("migration-overview-task-table")).toBeVisible();
        await expect(page.getByTestId("migration-series-link")).toContainText("CPIH");
        await expect(page.getByTestId("migration-series-link")).toHaveAttribute("href", "/data-admin/data-admin/series/new-dataset");

        await expect(page.getByTestId("migration-job-table-edition-latestversion")).toContainText("latestversion");
        await expect(page.getByTestId("migration-job-table-edition-latestversion"))
            .toHaveAttribute("href", "/data-admin/data-admin/series/new-dataset/editions/latestversion");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-1")).toContainText("Version 1");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-1"))
            .toHaveAttribute("href", "/data-admin/data-admin/series/new-dataset/editions/latestversion/versions/1");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-2")).toContainText("Version 2");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-2"))
            .toHaveAttribute("href", "/data-admin/data-admin/series/new-dataset/editions/latestversion/versions/2");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-3")).toContainText("Version 3");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-3"))
            .toHaveAttribute("href", "/data-admin/data-admin/series/new-dataset/editions/latestversion/versions/3");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-4")).toContainText("Version 4");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-4"))
            .toHaveAttribute("href", "/data-admin/data-admin/series/new-dataset/editions/latestversion/versions/4");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-5")).toContainText("Version 5");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-5"))
            .toHaveAttribute("href", "/data-admin/data-admin/series/new-dataset/editions/latestversion/versions/5");
    });

    test.describe("Handles API error", () => {
        test("When 404 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./migration/404");
            await expect(page.getByText("There was an issue retrieving the data for this page. Try refreshing the page.")).toBeVisible();
        });

            test("When 500 is returned", async ({ page, context }) => {
            setValidAuthCookies(context);
            await page.goto("./migration/500");
            await expect(page.getByText("There was an issue retrieving the data for this page. Try refreshing the page.")).toBeVisible();
        });
    });
});