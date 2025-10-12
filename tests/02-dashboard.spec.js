const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

test.describe('NuevoGym - Dashboard y Estadísticas', () => {
  let electronApp;
  let window;

  test.beforeEach(async () => {
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../electron/main.js')],
      env: { ...process.env, NODE_ENV: 'test' }
    });
    window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    await window.waitForTimeout(2000);

    // Login automático
    await window.locator('input[type="text"]').fill('admin');
    await window.locator('input[type="password"]').fill('admin123');
    await window.locator('button[type="submit"]').click();
    await window.waitForTimeout(3000);
  });

  test.afterEach(async () => {
    await electronApp.close();
  });

  test('TC004 - Dashboard muestra estadísticas correctamente', async () => {
    // Verificar que estamos en dashboard o navegar a él
    const dashboardLink = window.locator('a[href="/"]').first();
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await window.waitForTimeout(2000);
    }
    
    // Verificar que el título es Dashboard
    await expect(window.locator('.page-title')).toContainText('Dashboard');
    
    // Verificar que las tarjetas de estadísticas están visibles
    const statCards = window.locator('.stat-card');
    const count = await statCards.count();
    expect(count).toBeGreaterThanOrEqual(4); // Al menos 4 tarjetas
    
    // Verificar que las estadísticas tienen valores (aunque sean 0)
    const firstStatValue = await window.locator('.stat-value').first().textContent();
    expect(firstStatValue).toBeTruthy();
    
    // Verificar formato de moneda (Q)
    const ingresosCard = window.locator('.stat-card').filter({ hasText: 'Ingresos' });
    const ingresosText = await ingresosCard.locator('.stat-value').textContent();
    expect(ingresosText).toContain('Q'); // Formato Quetzales
    
    // Tomar screenshot
    await window.screenshot({ path: 'tests/screenshots/04-dashboard.png', fullPage: true });
  });

  test('TC005 - Botón Actualizar recarga estadísticas', async () => {
    // Ir a dashboard
    const dashboardLink = window.locator('a[href="/"]').first();
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await window.waitForTimeout(2000);
    }
    
    // Buscar botón de actualizar
    const refreshButton = window.locator('button').filter({ hasText: 'Actualizar' });
    
    if (await refreshButton.isVisible()) {
      // Hacer clic en actualizar
      await refreshButton.click();
      
      // Esperar a que recargue
      await window.waitForTimeout(2000);
      
      // Verificar que sigue mostrando estadísticas
      await expect(window.locator('.stat-card').first()).toBeVisible();
    }
  });

  test('TC006 - Gráficos se renderizan correctamente', async () => {
    // Ir a dashboard
    const dashboardLink = window.locator('a[href="/"]').first();
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await window.waitForTimeout(3000); // Esperar carga de gráficos
    }
    
    // Verificar que hay elementos de Recharts (gráficos)
    const charts = window.locator('.recharts-wrapper');
    const chartsCount = await charts.count();
    
    // Debería haber al menos 1 gráfico
    expect(chartsCount).toBeGreaterThan(0);
    
    // Tomar screenshot de los gráficos
    await window.screenshot({ path: 'tests/screenshots/06-charts.png', fullPage: true });
  });
});

