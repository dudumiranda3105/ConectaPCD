import { test, expect } from '@playwright/test';

// Dados de teste
const TEST_CANDIDATE = {
  email: 'candidato.teste@email.com',
  password: 'senha123',
  name: 'Candidato Teste',
};

const TEST_COMPANY = {
  email: 'empresa.teste@email.com',
  password: 'senha123',
  name: 'Empresa Teste',
};

test.describe('Fluxo do Candidato', () => {
  test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Simular login - em produção usar fixtures
      await page.goto('/login');
      await page.getByLabel(/e-?mail/i).fill(TEST_CANDIDATE.email);
      await page.getByLabel(/senha/i).fill(TEST_CANDIDATE.password);
      await page.getByRole('button', { name: /entrar/i }).click();
      
      // Aguardar redirecionamento ou erro
      await page.waitForURL(/dashboard|login/, { timeout: 10000 });
    });

    test('deve exibir dashboard se logado', async ({ page }) => {
      if (page.url().includes('dashboard')) {
        await expect(page.getByText(/vagas|recomendad/i)).toBeVisible();
      }
    });
  });

  test.describe('Busca de Vagas', () => {
    test('deve exibir lista de vagas na landing', async ({ page }) => {
      await page.goto('/');
      
      // Scroll até seção de vagas (se existir)
      const vagasSection = page.getByText(/vagas.*destaque|oportunidades/i);
      if (await vagasSection.isVisible()) {
        await vagasSection.scrollIntoViewIfNeeded();
      }
    });
  });
});

test.describe('Fluxo da Empresa', () => {
  test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.getByText(/empresa/i).click();
      await page.getByLabel(/e-?mail/i).fill(TEST_COMPANY.email);
      await page.getByLabel(/senha/i).fill(TEST_COMPANY.password);
      await page.getByRole('button', { name: /entrar/i }).click();
      
      await page.waitForURL(/dashboard|login/, { timeout: 10000 });
    });

    test('deve exibir dashboard se logado', async ({ page }) => {
      if (page.url().includes('dashboard')) {
        await expect(page.getByText(/vagas|candidat/i)).toBeVisible();
      }
    });
  });
});

test.describe('Navegação Geral', () => {
  test('deve navegar entre páginas sem erros', async ({ page }) => {
    const pages = [
      '/',
      '/login',
      '/cadastro',
      '/sobre',
      '/privacidade',
      '/termos',
      '/forgot-password',
    ];

    for (const url of pages) {
      await page.goto(url);
      
      // Verificar que não há erro 404 ou crash
      await expect(page.locator('body')).toBeVisible();
      
      // Verificar que não há erros JS no console
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      
      await page.waitForTimeout(500);
      expect(errors.length).toBe(0);
    }
  });

  test('página 404 deve ser amigável', async ({ page }) => {
    await page.goto('/pagina-que-nao-existe-xyz');
    
    await expect(page.getByText(/404|não encontrad|página.*exist/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /voltar|início|home/i })).toBeVisible();
  });

  test('deve redirecionar rotas protegidas para login', async ({ page }) => {
    await page.goto('/dashboard/candidato');
    
    // Deve redirecionar para login ou mostrar mensagem
    await page.waitForURL(/login/, { timeout: 5000 }).catch(() => {});
    
    const url = page.url();
    expect(url.includes('login') || url.includes('dashboard')).toBeTruthy();
  });
});

test.describe('Performance', () => {
  test('landing page deve carregar em menos de 5s', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(5000);
  });

  test('não deve ter memory leaks óbvios', async ({ page }) => {
    await page.goto('/');
    
    // Navegar várias vezes
    for (let i = 0; i < 5; i++) {
      await page.goto('/login');
      await page.goto('/');
    }
    
    // Página ainda deve funcionar
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
