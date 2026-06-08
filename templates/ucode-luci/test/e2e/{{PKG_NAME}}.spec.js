const { test, expect } = require('@playwright/test');

async function login(page) {
	await page.goto('/cgi-bin/luci/');
	await page.fill('input[name="luci_username"]', 'root');
	await page.fill('input[name="luci_password"]', 'admin');
	await page.click('button.cbi-button-positive');
	await expect(page).toHaveURL(/\/cgi-bin\/luci/);
}

test.describe('{{PKG_NAME}} settings', () => {
	test.beforeEach(async ({ page }) => {
		await login(page);
	});

	test('saves the name', async ({ page }) => {
		await page.goto('/cgi-bin/luci/admin/services/{{PKG_NAME}}');
		await page.fill('input[id$="main.name"]', 'Alice');
		await page.click('button.cbi-button-save');
		await page.reload();
		await expect(page.locator('input[id$="main.name"]')).toHaveValue('Alice');
	});

	test.afterEach(async ({ page }) => {
		await page.goto('/cgi-bin/luci/admin/services/{{PKG_NAME}}');
		await page.fill('input[id$="main.name"]', 'World');
		await page.click('button.cbi-button-save');
	});
});
