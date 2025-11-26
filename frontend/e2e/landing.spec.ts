import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar a página inicial', async ({ page }) => {
    await expect(page).toHaveTitle(/ConectaPCD/i);
  });

  test('deve exibir o header com navegação', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: /login|entrar/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /cadastr/i })).toBeVisible();
  });

  test('deve exibir a seção hero', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /começar|cadastr/i })).toBeVisible();
  });

  test('deve navegar para página de login', async ({ page }) => {
    await page.getByRole('link', { name: /login|entrar/i }).click();
    await expect(page).toHaveURL(/login/);
  });

  test('deve navegar para página de cadastro', async ({ page }) => {
    await page.getByRole('link', { name: /cadastr/i }).first().click();
    await expect(page).toHaveURL(/cadastro/);
  });

  test('deve ter links do footer funcionais', async ({ page }) => {
    await expect(page.getByRole('link', { name: /privacidade/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /termos/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sobre/i })).toBeVisible();
  });
});
