import { test, expect } from '@playwright/test';

test('renders portfolio navigation and jwt auth lab', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toContainText('Reyderson Rodriguez');
  await expect(page.locator('app-top-nav')).toContainText(
    'NEURAL_ARCHITECT_V1.0',
  );

  await page.getByRole('link', { name: /_auth_lab/i }).click();
  await page.getByRole('button', { name: 'Emitir JWT' }).click();

  await expect(page.locator('.auth-state')).toContainText('SESSION_ACTIVE');
  await expect(page.locator('.claims-output')).toContainText(
    '"role": "recruiter"',
  );

  await page.getByRole('link', { name: /_crud/i }).click();
  await page
    .getByPlaceholder('Work item title')
    .fill('Review portfolio CRUD lab');
  await page.getByPlaceholder('API, Frontend, Database').fill('Recruiter Demo');
  await page.getByRole('button', { name: 'CREATE_ROW()' }).click();
  await expect(page.locator('.crud-table')).toContainText(
    'Review portfolio CRUD lab',
  );

  await page.getByRole('link', { name: /_systems/i }).click();
  await page.getByRole('tab', { name: 'DB' }).click();
  await expect(page.locator('.blueprint-panel')).toContainText(
    'PostgreSQL relational model',
  );
});
