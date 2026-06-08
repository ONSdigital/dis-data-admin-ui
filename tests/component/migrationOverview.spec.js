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

        // body/summary content
        await expect(page.getByTestId("migration-overview-task-table")).toBeVisible();
        await expect(page.getByTestId("migration-series-link")).toContainText("CPIH");
        await expect(page.getByTestId("migration-series-link")).toHaveAttribute("href", "/data-admin/series/new-dataset");

        await expect(page.getByTestId("migration-job-table-edition-latestversion")).toContainText("latestversion");
        await expect(page.getByTestId("migration-job-table-edition-latestversion"))
            .toHaveAttribute("href", "/data-admin/series/new-dataset/editions/latestversion");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-1")).toContainText("Version 1");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-1"))
            .toHaveAttribute("href", "/data-admin/series/new-dataset/editions/latestversion/versions/1");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-2")).toContainText("Version 2");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-2"))
            .toHaveAttribute("href", "/data-admin/series/new-dataset/editions/latestversion/versions/2");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-3")).toContainText("Version 3");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-3"))
            .toHaveAttribute("href", "/data-admin/series/new-dataset/editions/latestversion/versions/3");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-4")).toContainText("Version 4");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-4"))
            .toHaveAttribute("href", "/data-admin/series/new-dataset/editions/latestversion/versions/4");

        await expect(page.getByTestId("migration-job-table-edition-latestversion-5")).toContainText("Version 5");
        await expect(page.getByTestId("migration-job-table-edition-latestversion-5"))
            .toHaveAttribute("href", "/data-admin/series/new-dataset/editions/latestversion/versions/5");

        await expect(page.getByTestId("migration-approve-button")).toBeVisible();
        await expect(page.getByTestId("migration-approve-button")).toHaveText("Approve");

        await expect(page.getByTestId("migration-reject-button")).toBeVisible();
        await expect(page.getByTestId("migration-reject-button")).toHaveText("Reject");
    });

    test("Clicking approve redirects to migration list page with relevant success message", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/1");

        await page.getByTestId("migration-approve-button").click();
        await page.waitForURL("**/migration?display_approve_success=true&series=new-dataset**");

        expect(page.url().toString()).toContain("/migration?display_approve_success=true&series=new-dataset");
        await expect(page.getByTestId("success-panel")).toBeVisible();
        await expect(page.getByTestId("success-panel")).toContainText("Migration for new-dataset approved.");
    });

    test("Clicking reject redirects to are you sure and then to migration list page with relevant message", async ({ page, context }) => {
        setValidAuthCookies(context);

        await page.goto("./migration/1");

        await page.getByTestId("migration-reject-button").click();

        await page.waitForURL("**/migration/1/reject/new-dataset**");
        expect(page.url().toString()).toContain("/migration/1/reject/new-dataset");

        await page.getByTestId("migration-reject-button").click();
        await page.waitForURL("**/migration?display_rejected_success=true&series=new-dataset**");

        expect(page.url().toString()).toContain("/migration?display_rejected_success=true&series=new-dataset");
        await expect(page.getByTestId("success-panel")).toBeVisible();
        await expect(page.getByTestId("success-panel")).toContainText("Migration for new-dataset reverted.");
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