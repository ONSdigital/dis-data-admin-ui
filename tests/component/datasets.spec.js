import { test, expect } from '@playwright/test';

import { addValidAuthCookies } from "../utils/utils";

test.describe('series', () => {
    test("Renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series')
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Dataset Series');
        await expect(page.getByRole('link', { name: 'Weekly deaths' })).toBeVisible();
    });

    test("Route from Series page to Create Dataset page", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series')
        await page.getByRole('link', { name: 'Add New Dataset Series' }).click();
        await page.waitForURL('**/series/create');
        await expect(page.url().toString()).toContain('series/create');
    });

    test("Choose from a list of datasets and route to chosen dataset page", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series')
        await page.getByRole('link', { name: 'Test dataset' }).click();
        await expect(page.getByText('test-dataset')).toBeVisible();
        await expect(page.getByText('Available editions')).toBeVisible();
        await page.waitForURL('**/series/test-dataset');
        await expect(page.url().toString()).toContain('series/test-dataset');
    });
});

test.describe('create', () => {
    test("Renders as expected", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series/create')
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Create dataset series');
    });

    test("Route from Create dataset series page to Series page", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series/create')
        await page.getByRole('link', { name: 'View Existing Dataset Series' }).click();
        await page.waitForURL('**/series');
        await expect(page.url().toString()).toContain('series');
    });

    test("Submit form successfully", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series/create')
        await page.getByLabel('Title').fill('test title');
        await page.getByLabel('ID', {exact: true}).fill('test ID');
        await page.getByLabel('Topics').selectOption('2945');
        await page.getByRole('button', { name: /Add Topic/i }).click();
        await page.getByTestId('field-dataset-series-description').getByRole('textbox').fill('test description');
        await page.getByLabel('Name').fill('test name');
        await page.getByLabel('Email').fill('test-email@test.com');
        await page.getByRole('button', { name: /Add contact/i }).click();
        await page.getByRole('button', { name: /Save new dataset series/i }).click();

        await expect(page.getByText('Form submitted successfully')).toBeVisible();
    });

    test("Show errors on mandatory fields", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series/create')

        await page.getByRole('button', { name: /Save new dataset series/i }).click();

        await expect(page.getByText('There was a problem submitting your form')).toBeVisible();
        await expect(page.getByLabel('There was a problem').getByText('Title is required')).toBeVisible();
        await expect(page.getByLabel('There was a problem').getByText('ID is required')).toBeVisible();
        await expect(page.getByLabel('There was a problem').getByText('Description is required')).toBeVisible();
        await expect(page.getByLabel('There was a problem').getByText('Contact is required')).toBeVisible();

        await expect(page.getByTestId('field-dataset-series-title-error').getByText('Title is required')).toBeVisible();
        await expect(page.getByTestId('field-dataset-series-id-error').getByText('ID is required')).toBeVisible();
        await expect(page.getByTestId('field-dataset-series-description-error').getByText('Description is required')).toBeVisible();
        await expect(page.getByTestId('field-dataset-series-contacts-error').getByText('Contact is required')).toBeVisible();
    });

    test("Show error on invalid email", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series/create')

        await page.getByLabel('Email').fill('test-email');
        await page.getByRole('button', { name: /Add contact/i }).click();
        await expect(page.getByTestId('field-dataset-series-contact-email-error').getByText('Invalid email')).toBeVisible();
    });

    test("Does not allow duplicate dataset series to be created", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series/create')
        await page.getByLabel('Title').fill('test title');
        await page.getByLabel('ID', {exact: true}).fill('test dup');
        await page.getByLabel('Topics').selectOption('2945');
        await page.getByRole('button', { name: /Add Topic/i }).click();
        await page.getByTestId('field-dataset-series-description').getByRole('textbox').fill('test description');
        await page.getByLabel('Name').fill('test name');
        await page.getByLabel('Email').fill('tes-email@test.com');
        await page.getByRole('button', { name: /Add contact/i }).click();
        await page.getByRole('button', { name: /Save new dataset series/i }).click();

        await expect(page.getByText('This datasetseries already exists')).toBeVisible();
    });
});

test.describe('edit', () => {
    test("Route from dataset series id page to edit page", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series')
        await page.getByRole('link', { name: 'Test dataset' }).click();
        await page.waitForURL('**/series/test-dataset');
        await page.getByRole('link', { name: 'Edit Metadata' }).click();
        await page.waitForURL('**/series/test-dataset/edit');

        await expect(page.url().toString()).toContain('series/test-dataset/edit');
    });

    test("Submit form successfully", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series/mock-quarterly/edit')

        await page.getByTestId('dataset-series-title').fill('test edit title');
        await page.getByLabel('Topics').selectOption('3161');
        await page.getByRole('button', { name: /Add Topic/i }).click();
        await page.getByTestId('field-dataset-series-description').getByRole('textbox').fill('test edit description');
        await page.getByLabel('Name').fill('test edit name');
        await page.getByLabel('Email').fill('test-email-edit@test.com');
        await page.getByRole('button', { name: /Add contact/i }).click();
        await page.getByRole('button', { name: /Save new dataset series/i }).click();

        await expect(page.getByText('Form submitted successfully')).toBeVisible();
    });
});