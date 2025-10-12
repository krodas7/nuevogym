const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

test.describe('NuevoGym - Login y Autenticación', () => {
  let electronApp;
  let window;

  test.beforeEach(async () => {
    // Iniciar la aplicación Electron
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../electron/main.js')],
      env: {
        ...process.env,
        NODE_ENV: 'test'
      }
    });

    // Esperar a que se cargue la primera ventana
    window = await electronApp.firstWindow();
    
    // Esperar a que el DOM esté listo
    await window.waitForLoadState('domcontentloaded');
    await window.waitForTimeout(2000); // Esperar a que Electron inicialice
  });

  test.afterEach(async () => {
    // Cerrar la aplicación
    await electronApp.close();
  });

  test('TC001 - Login exitoso con credenciales válidas', async () => {
    // Verificar que estamos en la página de login
    await expect(window.locator('h1.login-title')).toContainText('NuevoGym');
    
    // Llenar formulario de login
    await window.locator('input[type="text"]').fill('admin');
    await window.locator('input[type="password"]').fill('admin123');
    
    // Tomar screenshot del formulario lleno
    await window.screenshot({ path: 'tests/screenshots/01-login-form.png' });
    
    // Hacer clic en iniciar sesión
    await window.locator('button[type="submit"]').click();
    
    // Esperar a que cargue el dashboard o primer módulo
    await window.waitForTimeout(3000);
    
    // Verificar que el login fue exitoso (desaparece el login)
    const loginVisible = await window.locator('.login-container').isVisible().catch(() => false);
    expect(loginVisible).toBe(false);
    
    // Verificar que se muestra el sidebar
    await expect(window.locator('.sidebar')).toBeVisible();
    
    // Verificar que aparece el nombre del usuario en el sidebar
    await expect(window.locator('.sidebar')).toContainText('Administrador');
    
    // Tomar screenshot del sistema logueado
    await window.screenshot({ path: 'tests/screenshots/01-logged-in.png' });
  });

  test('TC002 - Login falla con credenciales inválidas', async () => {
    // Verificar que estamos en login
    await expect(window.locator('h1.login-title')).toContainText('NuevoGym');
    
    // Intentar login con credenciales incorrectas
    await window.locator('input[type="text"]').fill('usuario_invalido');
    await window.locator('input[type="password"]').fill('password_incorrecto');
    await window.locator('button[type="submit"]').click();
    
    // Esperar mensaje de error
    await window.waitForTimeout(2000);
    
    // Verificar que se muestra error
    const errorVisible = await window.locator('.alert-error').isVisible().catch(() => false);
    expect(errorVisible).toBe(true);
    
    // Verificar que NO se hizo login (sigue en login)
    await expect(window.locator('.login-container')).toBeVisible();
    
    // Tomar screenshot del error
    await window.screenshot({ path: 'tests/screenshots/02-login-error.png' });
  });

  test('TC003 - Sesión persiste en localStorage', async () => {
    // Login exitoso
    await window.locator('input[type="text"]').fill('admin');
    await window.locator('input[type="password"]').fill('admin123');
    await window.locator('button[type="submit"]').click();
    await window.waitForTimeout(3000);
    
    // Verificar que localStorage tiene el usuario
    const localStorage = await window.evaluate(() => {
      return window.localStorage.getItem('usuario');
    });
    
    expect(localStorage).toBeTruthy();
    const usuario = JSON.parse(localStorage);
    expect(usuario.usuario).toBe('admin');
    expect(usuario.rol).toBe('admin');
  });
});

