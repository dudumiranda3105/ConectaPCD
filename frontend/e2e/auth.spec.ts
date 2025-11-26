import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('deve exibir formulário de login', async ({ page }) => {
      await expect(page.getByLabel(/e-?mail/i)).toBeVisible();
      await expect(page.getByLabel(/senha/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
    });

    test('deve exibir seletor de tipo de conta', async ({ page }) => {
      await expect(page.getByText(/candidato/i)).toBeVisible();
      await expect(page.getByText(/empresa/i)).toBeVisible();
    });

    test('deve exibir link para esqueci senha', async ({ page }) => {
      await expect(page.getByRole('link', { name: /esquec/i })).toBeVisible();
    });

    test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
      await page.getByLabel(/e-?mail/i).fill('teste@invalido.com');
      await page.getByLabel(/senha/i).fill('senhaerrada');
      await page.getByRole('button', { name: /entrar/i }).click();
      
      // Aguardar mensagem de erro
      await expect(page.getByText(/erro|inválid|falha/i)).toBeVisible({ timeout: 10000 });
    });

    test('deve validar email obrigatório', async ({ page }) => {
      await page.getByLabel(/senha/i).fill('senha123');
      await page.getByRole('button', { name: /entrar/i }).click();
      
      await expect(page.getByText(/email.*obrigatório|email.*válido/i)).toBeVisible();
    });

    test('deve navegar para página de cadastro', async ({ page }) => {
      await page.getByRole('link', { name: /cadastr.*gratuit/i }).click();
      await expect(page).toHaveURL(/cadastro/);
    });
  });

  test.describe('Esqueci Senha', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/forgot-password');
    });

    test('deve exibir formulário de recuperação', async ({ page }) => {
      await expect(page.getByText(/esqueceu.*senha/i)).toBeVisible();
      await expect(page.getByLabel(/e-?mail/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /enviar/i })).toBeVisible();
    });

    test('deve ter seletor de tipo de conta', async ({ page }) => {
      await expect(page.getByText(/candidato/i)).toBeVisible();
      await expect(page.getByText(/empresa/i)).toBeVisible();
    });

    test('deve voltar para login', async ({ page }) => {
      await page.getByRole('link', { name: /voltar.*login/i }).click();
      await expect(page).toHaveURL(/login/);
    });
  });

  test.describe('Cadastro', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/cadastro');
    });

    test('deve exibir opções de perfil', async ({ page }) => {
      await expect(page.getByText(/candidato/i)).toBeVisible();
      await expect(page.getByText(/empresa/i)).toBeVisible();
    });

    test('deve navegar para cadastro de candidato', async ({ page }) => {
      await page.getByText(/candidato/i).click();
      await expect(page).toHaveURL(/cadastro\/candidato/);
    });

    test('deve navegar para cadastro de empresa', async ({ page }) => {
      await page.getByText(/empresa/i).click();
      await expect(page).toHaveURL(/cadastro\/empresa/);
    });
  });
});
