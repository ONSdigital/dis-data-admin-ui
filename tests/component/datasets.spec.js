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
        await expect(page.getByTestId('id-field')).toContainText('mock-quarterly');
        await expect(page.getByTestId('type-field')).toContainText('static');
        await expect(page.getByTestId('title-field')).toContainText('Mock Dataset');
        await expect(page.getByTestId('description-field')).toContainText('This is a mock dataset test description');
        await expect(page.getByTestId('topics-field')).toBeVisible();
        await expect(page.getByTestId('topics-field')).toContainText('Education');
        await expect(page.getByTestId('topics-field')).toContainText('Business');
        await expect(page.getByTestId('last-updated-field')).toContainText('1 January 2000');
        await expect(page.getByTestId('license-field')).toContainText('My License');
        await expect(page.getByTestId('next-release-field')).toContainText('TBC');
        await expect(page.getByTestId('keywords-field')).toBeVisible();
        await expect(page.getByTestId('keywords-field')).toContainText('mock');
        await expect(page.getByTestId('keywords-field')).toContainText('test');
        await expect(page.getByTestId('qmi-field')).toContainText('https://www.ons.gov.uk');
        await expect(page.getByTestId('contacts-field')).toBeVisible();
        await expect(page.getByTestId('contact-name-field-0')).toContainText('First Contact');
        await expect(page.getByTestId('contact-email-field-0')).toHaveAttribute('href', 'mailto:contactOne@ons.gov.uk');
        await expect(page.getByTestId('contact-telephone-field-0')).toHaveAttribute('href', 'tel:+44 1234 567891');
        await expect(page.getByTestId('contact-name-field-1')).toContainText('Second Contact');
        await expect(page.getByTestId('contact-email-field-1')).toHaveAttribute('href', 'mailto:contactTwo@ons.gov.uk')
        await expect(page.getByTestId('contact-telephone-field-1')).toHaveAttribute('href', 'tel:+44 1234 567892');
        await expect(page.getByTestId('publisher-name-field')).toContainText('ONS');
        await expect(page.getByTestId('publisher-href-field')).toContainText('https://www.ons.gov.uk');
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
        await page.getByTestId('field-datasetseriesdescription').getByRole('textbox').fill('test description');
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

        await expect(page.getByTestId('field-datasetseriestitle-error').getByText('Title is required')).toBeVisible();
        await expect(page.getByTestId('field-datasetseriesid-error').getByText('ID is required')).toBeVisible();
        await expect(page.getByTestId('field-datasetseriesdescription-error').getByText('Description is required')).toBeVisible();
        await expect(page.getByTestId('field-datasetseriescontacts-error').getByText('Contact is required')).toBeVisible();
    });

    test("Show error on invalid email", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series/create')

        await page.getByLabel('Email').fill('test-email');
        await page.getByRole('button', { name: /Add contact/i }).click();
        await expect(page.getByTestId('field-datasetseriescontactemail-error').getByText('Invalid email')).toBeVisible();
    });

    test("Does not allow duplicate dataset series to be created", async ({ page, context }) => {
        addValidAuthCookies(context);

        await page.goto('./series/create')
        await page.getByLabel('Title').fill('test title');
        await page.getByLabel('ID', {exact: true}).fill('test dup');
        await page.getByTestId('field-datasetseriesdescription').getByRole('textbox').fill('test description');
        await page.getByLabel('Name').fill('test name');
        await page.getByLabel('Email').fill('tes-email@test.com');
        await page.getByRole('button', { name: /Add contact/i }).click();
        await page.getByRole('button', { name: /Save new dataset series/i }).click();

        await expect(page.getByText('This datasetseries already exists')).toBeVisible();
    });
});
