const { test, expect } = require('@playwright/test');
const path = require('path');

const pageUrl = `file://${path.resolve(__dirname, '..', 'index.html')}`;

test.beforeEach(async ({ page }) => {
  await page.goto(pageUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('shows the empty state when there are no tasks', async ({ page }) => {
  await expect(page.getByTestId('empty-state')).toBeVisible();
  await expect(page.getByTestId('task-item')).toHaveCount(0);
});

test('adds a task via the button', async ({ page }) => {
  await page.getByTestId('task-input').fill('Buy milk');
  await page.getByTestId('add-button').click();

  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await expect(page.getByTestId('task-item')).toContainText('Buy milk');
  await expect(page.getByTestId('empty-state')).toBeHidden();
});

test('adds a task by pressing Enter', async ({ page }) => {
  await page.getByTestId('task-input').fill('Walk the dog');
  await page.getByTestId('task-input').press('Enter');

  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await expect(page.getByTestId('task-input')).toHaveValue('');
});

test('does not add an empty or whitespace-only task', async ({ page }) => {
  await page.getByTestId('task-input').fill('   ');
  await page.getByTestId('add-button').click();

  await expect(page.getByTestId('task-item')).toHaveCount(0);
  await expect(page.getByTestId('empty-state')).toBeVisible();
});

test('marks a task complete and shows it struck through', async ({ page }) => {
  await page.getByTestId('task-input').fill('Read a book');
  await page.getByTestId('add-button').click();

  const task = page.getByTestId('task-item').first();
  await task.getByTestId('task-checkbox').check();

  await expect(task).toHaveClass(/completed/);
});

test('deletes a task', async ({ page }) => {
  await page.getByTestId('task-input').fill('Temporary task');
  await page.getByTestId('add-button').click();
  await expect(page.getByTestId('task-item')).toHaveCount(1);

  await page.getByTestId('delete-button').click();

  await expect(page.getByTestId('task-item')).toHaveCount(0);
  await expect(page.getByTestId('empty-state')).toBeVisible();
});

test('persists tasks across a page reload', async ({ page }) => {
  await page.getByTestId('task-input').fill('Survives reload');
  await page.getByTestId('add-button').click();

  await page.reload();

  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await expect(page.getByTestId('task-item')).toContainText('Survives reload');
});
