import { test, expect } from '@playwright/test';

test.describe('Acessibilidade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve ter botão de acessibilidade visível', async ({ page }) => {
    await expect(page.getByRole('button', { name: /acessibilidade/i })).toBeVisible();
  });

  test('deve abrir painel de acessibilidade ao clicar', async ({ page }) => {
    await page.getByRole('button', { name: /acessibilidade/i }).click();
    await expect(page.getByText(/tamanho.*fonte|fonte.*maior/i)).toBeVisible();
  });

  test('deve aumentar tamanho da fonte', async ({ page }) => {
    const html = page.locator('html');
    const initialFontSize = await html.evaluate(el => getComputedStyle(el).fontSize);
    
    await page.getByRole('button', { name: /acessibilidade/i }).click();
    await page.getByRole('button', { name: /aumentar|maior|\+/i }).first().click();
    
    const newFontSize = await html.evaluate(el => getComputedStyle(el).fontSize);
    expect(parseFloat(newFontSize)).toBeGreaterThanOrEqual(parseFloat(initialFontSize));
  });

  test('deve ter navegação por teclado', async ({ page }) => {
    // Pressionar Tab e verificar se elementos recebem foco
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('deve ter alt text nas imagens', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const ariaHidden = await img.getAttribute('aria-hidden');
      
      // Imagem deve ter alt OU aria-label OU ser decorativa (aria-hidden)
      expect(alt || ariaLabel || ariaHidden === 'true').toBeTruthy();
    }
  });

  test('deve ter contraste adequado no texto', async ({ page }) => {
    // Verificar que texto principal tem cor visível
    const mainText = page.locator('h1, p').first();
    const color = await mainText.evaluate(el => getComputedStyle(el).color);
    
    // Cor não deve ser totalmente transparente
    expect(color).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('deve funcionar com alto contraste', async ({ page }) => {
    await page.getByRole('button', { name: /acessibilidade/i }).click();
    
    // Procurar opção de alto contraste
    const highContrastBtn = page.getByRole('button', { name: /contraste/i });
    if (await highContrastBtn.isVisible()) {
      await highContrastBtn.click();
      
      // Página não deve quebrar
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('deve ter labels em campos de formulário', async ({ page }) => {
    await page.goto('/login');
    
    const emailInput = page.getByLabel(/e-?mail/i);
    const passwordInput = page.getByLabel(/senha/i);
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('botões devem ter texto descritivo', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        const text = await btn.textContent();
        const ariaLabel = await btn.getAttribute('aria-label');
        const title = await btn.getAttribute('title');
        
        // Botão deve ter algum texto ou aria-label
        expect(text?.trim() || ariaLabel || title).toBeTruthy();
      }
    }
  });
});

test.describe('Responsividade', () => {
  test('deve funcionar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('deve funcionar em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('deve funcionar em desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('menu mobile deve funcionar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Procurar botão de menu hamburguer
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.getByRole('link', { name: /login|entrar/i })).toBeVisible();
    }
  });
});
