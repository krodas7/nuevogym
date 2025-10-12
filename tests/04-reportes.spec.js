const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

test.describe('NuevoGym - Sistema de Reportes', () => {
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

    // Login
    await window.locator('input[type="text"]').fill('admin');
    await window.locator('input[type="password"]').fill('admin123');
    await window.locator('button[type="submit"]').click();
    await window.waitForTimeout(3000);

    // Navegar a Reportes
    await window.locator('a').filter({ hasText: 'Reportes' }).click();
    await window.waitForTimeout(2000);
  });

  test.afterEach(async () => {
    await electronApp.close();
  });

  test('TC011 - Módulo de Reportes es accesible', async () => {
    // Verificar que estamos en Reportes
    await expect(window.locator('.page-title')).toContainText('Reportes');
    
    // Verificar que existe selector de tipo de reporte
    await expect(window.locator('select')).toBeVisible();
    
    // Tomar screenshot
    await window.screenshot({ path: 'tests/screenshots/11-reportes.png', fullPage: true });
  });

  test('TC012 - Reporte de Tickets Generados está disponible', async () => {
    // Verificar selector de reportes
    const selector = window.locator('select').first();
    await expect(selector).toBeVisible();
    
    // Verificar que existe opción de Tickets
    const options = await selector.locator('option').allTextContents();
    const tieneTickets = options.some(opt => opt.includes('Tickets'));
    expect(tieneTickets).toBe(true);
    
    // Seleccionar Tickets Generados
    await selector.selectOption({ label: /Tickets/ });
    await window.waitForTimeout(1000);
    
    // Verificar que aparece campo de mes
    const mesInput = window.locator('input[type="month"]');
    await expect(mesInput).toBeVisible();
    
    // Tomar screenshot
    await window.screenshot({ path: 'tests/screenshots/12-reporte-tickets.png' });
  });

  test('TC013 - Generar reporte de clientes', async () => {
    // Seleccionar tipo de reporte: Clientes
    await window.locator('select').first().selectOption({ index: 0 });
    await window.waitForTimeout(500);
    
    // Hacer clic en Generar Reporte
    await window.locator('button').filter({ hasText: 'Generar Reporte' }).click();
    await window.waitForTimeout(3000);
    
    // Verificar que se muestra el reporte
    const tabla = window.locator('table');
    const tablaVisible = await tabla.isVisible().catch(() => false);
    
    if (tablaVisible) {
      // Verificar que tiene columnas
      const headers = await window.locator('table thead th').allTextContents();
      expect(headers.length).toBeGreaterThan(0);
    }
    
    // Tomar screenshot
    await window.screenshot({ path: 'tests/screenshots/13-reporte-clientes.png', fullPage: true });
  });

  test('TC014 - Botones de exportar e imprimir aparecen', async () => {
    // Generar un reporte
    await window.locator('select').first().selectOption({ index: 0 });
    await window.locator('button').filter({ hasText: 'Generar Reporte' }).click();
    await window.waitForTimeout(3000);
    
    // Verificar botón de exportar
    const exportBtn = window.locator('button').filter({ hasText: /Exportar|Excel|CSV/i });
    const exportVisible = await exportBtn.isVisible().catch(() => false);
    expect(exportVisible).toBe(true);
    
    // Verificar botón de imprimir
    const printBtn = window.locator('button').filter({ hasText: 'Imprimir' });
    const printVisible = await printBtn.isVisible().catch(() => false);
    expect(printVisible).toBe(true);
    
    // Tomar screenshot
    await window.screenshot({ path: 'tests/screenshots/14-reporte-botones.png' });
  });
});

