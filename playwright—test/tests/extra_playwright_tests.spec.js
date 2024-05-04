const { test, expect } = require('@playwright/test');

const websiteURL = 'http://127.0.0.1:5500/people.html';

test.beforeEach(async ({ page }) => {
    await page.goto(websiteURL);
});

test('all navigation links should be correct', async ({ page }) => {
    const expectedLinks = [
        { text: 'Home', href: 'index.html' },
        { text: 'Vehicle Search', href: 'vehicles.html' },
        { text: 'Add a Vehicle', href: 'add_vehicles.html' }
    ];
    await page.goto(websiteURL);
    for (const link of expectedLinks) {
        const href = await page.getByRole('link', { name: link.text }).getAttribute('href');
        expect(href).toBe(link.href);
    }
});

test('search with empty input should show error', async ({ page }) => {
    await page.locator('#name').fill('');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#message')).toContainText('Error');
});

test('search for non-existent vehicle registration number', async ({ page }) => {
    await page.getByRole('link', { name: 'Vehicle search' }).click();
    await page.locator('#rego').fill('NONEXIST123');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#message')).toContainText('No result found');
});

test('attempt to add an existing vehicle', async ({ page }) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
    await page.locator('#rego').fill('EXIST123'); 
    await page.getByRole('button', { name: 'Add vehicle' }).click();
    await expect(page.locator('#message')).toContainText('Error');
});

test('add a vehicle with missing information', async ({ page }) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
    await page.locator('#rego').fill('NEWREG123');
    await page.getByRole('button', { name: 'Add vehicle' }).click();
    await expect(page.locator('#message')).toContainText('Error');
});
