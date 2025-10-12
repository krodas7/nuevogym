const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

test.describe('NuevoGym - Gestión de Clientes', () => {
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

  test('TC007 - Navegar al módulo Clientes', async () => {
    // Hacer clic en el enlace de Clientes en el sidebar
    await window.locator('a').filter({ hasText: 'Clientes' }).first().click();
    await window.waitForTimeout(2000);
    
    // Verificar que estamos en el módulo correcto
    await expect(window.locator('.page-title')).toContainText('Clientes');
    
    // Verificar que hay botón "+ Nuevo Cliente"
    const nuevoClienteBtn = window.locator('button').filter({ hasText: 'Nuevo Cliente' });
    await expect(nuevoClienteBtn).toBeVisible();
    
    // Tomar screenshot
    await window.screenshot({ path: 'tests/screenshots/07-clientes.png', fullPage: true });
  });

  test('TC008 - Abrir modal de nuevo cliente', async () => {
    // Ir a Clientes
    await window.locator('a').filter({ hasText: 'Clientes' }).first().click();
    await window.waitForTimeout(2000);
    
    // Hacer clic en "+ Nuevo Cliente"
    await window.locator('button').filter({ hasText: 'Nuevo Cliente' }).click();
    await window.waitForTimeout(1000);
    
    // Verificar que se abrió el modal
    await expect(window.locator('.modal')).toBeVisible();
    await expect(window.locator('.modal-title')).toContainText('Cliente');
    
    // Verificar campos del formulario
    await expect(window.locator('input[placeholder*="Nombre"]')).toBeVisible();
    await expect(window.locator('input[type="tel"]')).toBeVisible();
    
    // Tomar screenshot del modal
    await window.screenshot({ path: 'tests/screenshots/08-nuevo-cliente-modal.png' });
  });

  test('TC009 - Crear cliente nuevo', async () => {
    // Ir a Clientes
    await window.locator('a').filter({ hasText: 'Clientes' }).first().click();
    await window.waitForTimeout(2000);
    
    // Abrir modal
    await window.locator('button').filter({ hasText: 'Nuevo Cliente' }).click();
    await window.waitForTimeout(1000);
    
    // Llenar datos básicos
    const nombreCliente = `Cliente Test ${Date.now()}`;
    await window.locator('input').filter({ hasText: /Nombre/i }).first().fill(nombreCliente);
    await window.locator('input[type="tel"]').fill('12345678');
    
    // Seleccionar tipo de membresía
    const selectMembresia = window.locator('select').first();
    await selectMembresia.selectOption({ index: 1 }); // Seleccionar primera opción
    
    // Tomar screenshot antes de guardar
    await window.screenshot({ path: 'tests/screenshots/09-cliente-form-filled.png' });
    
    // Hacer clic en Guardar
    await window.locator('button').filter({ hasText: 'Guardar' }).click();
    await window.waitForTimeout(2000);
    
    // Verificar que el modal se cerró
    const modalVisible = await window.locator('.modal').isVisible().catch(() => false);
    expect(modalVisible).toBe(false);
    
    // Verificar que la tabla se actualizó
    const tabla = window.locator('table tbody tr');
    const rowCount = await tabla.count();
    expect(rowCount).toBeGreaterThan(0);
    
    // Tomar screenshot del resultado
    await window.screenshot({ path: 'tests/screenshots/09-cliente-creado.png', fullPage: true });
  });

  test('TC010 - Búsqueda de clientes funciona', async () => {
    // Ir a Clientes
    await window.locator('a').filter({ hasText: 'Clientes' }).first().click();
    await window.waitForTimeout(2000);
    
    // Buscar el campo de búsqueda
    const searchInput = window.locator('input[placeholder*="Buscar"]').or(window.locator('input[type="search"]'));
    
    if (await searchInput.isVisible()) {
      // Escribir algo en búsqueda
      await searchInput.fill('Test');
      await window.waitForTimeout(1000);
      
      // Tomar screenshot del resultado filtrado
      await window.screenshot({ path: 'tests/screenshots/10-busqueda.png' });
    }
  });
});

