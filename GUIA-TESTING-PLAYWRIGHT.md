# 🧪 Guía de Testing con Playwright for Electron

## ✅ **Playwright YA Está Configurado**

---

## 🚀 **Ejecutar Tests (Comandos Simples)**

### **1. Ejecutar Todos los Tests:**
```bash
npm test
```

### **2. Ejecutar con Interfaz Visual:**
```bash
npm run test:ui
```

### **3. Ejecutar en Modo Debug:**
```bash
npm run test:debug
```

### **4. Ver Último Reporte:**
```bash
npm run test:report
```

---

## 📊 **Tests Disponibles (17 tests)**

### **✅ Login y Autenticación (3 tests)**
```
✓ Login exitoso con admin/admin123
✓ Login falla con credenciales inválidas
✓ Sesión persiste en localStorage
```

### **✅ Dashboard (3 tests)**
```
✓ Dashboard muestra estadísticas
✓ Botón actualizar funciona
✓ Gráficos se renderizan
```

### **✅ Gestión de Clientes (4 tests)**
```
✓ Navegar al módulo Clientes
✓ Abrir modal de nuevo cliente
✓ Crear cliente nuevo
✓ Búsqueda de clientes funciona
```

### **✅ Sistema de Reportes (4 tests)**
```
✓ Módulo de reportes es accesible
✓ Reporte de Tickets está disponible
✓ Generar reporte de clientes
✓ Botones de exportar e imprimir
```

### **✅ Control de Permisos (3 tests)**
```
✓ Admin ve todos los módulos
✓ Usuario limitado solo ve permitidos
✓ Módulos protegidos funcionan
```

---

## 🎯 **Diferencia con TestSprite**

| Aspecto | TestSprite | Playwright |
|---------|------------|------------|
| **Funciona con Electron** | ❌ NO | ✅ SÍ |
| **Acceso a electronAPI** | ❌ NO | ✅ SÍ |
| **Prueba .exe** | ❌ NO | ✅ SÍ |
| **Tests pasados** | 1/16 (6%) | 17/17 (100%) ✅ |

---

## 📸 **Screenshots Automáticos**

Cada test genera screenshots en:
```
tests/screenshots/
├── 01-login-form.png
├── 01-logged-in.png
├── 02-login-error.png
├── 04-dashboard.png
├── 06-charts.png
├── 07-clientes.png
├── 08-nuevo-cliente-modal.png
├── 09-cliente-form-filled.png
├── 09-cliente-creado.png
├── 10-busqueda.png
├── 11-reportes.png
├── 12-reporte-tickets.png
├── 13-reporte-clientes.png
├── 14-reporte-botones.png
├── 15-admin-sidebar.png
└── 16-permisos-admin.png
```

---

## 🎬 **Videos de Tests Fallidos**

Si un test falla, Playwright automáticamente graba un video:
```
test-results/
└── [nombre-test]/
    └── video.webm
```

---

## 📋 **Flujo de Trabajo**

### **Durante Desarrollo:**
```bash
1. Hacer cambios en el código
2. npm test
3. Ver si algo se rompió
4. Corregir si es necesario
5. git commit
```

### **Antes de Release:**
```bash
1. npm test
2. npm run test:report
3. Revisar reporte HTML
4. Si todo pasa → Crear instalador
5. Si algo falla → Corregir
```

---

## 🛠️ **Agregar Más Tests**

### **Crear Nuevo Archivo:**

```javascript
// tests/06-nuevo-modulo.spec.js
const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

test.describe('Módulo Nuevo', () => {
  let electronApp, window;

  test.beforeEach(async () => {
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../electron/main.js')]
    });
    window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    await window.waitForTimeout(2000);

    // Login
    await window.locator('input[type="text"]').fill('admin');
    await window.locator('input[type="password"]').fill('admin123');
    await window.locator('button[type="submit"]').click();
    await window.waitForTimeout(3000);
  });

  test.afterEach(async () => {
    await electronApp.close();
  });

  test('Mi nuevo test', async () => {
    // Tu lógica aquí
  });
});
```

---

## 🎨 **Selectores Útiles**

```javascript
// Por texto
window.locator('button').filter({ hasText: 'Guardar' })

// Por rol
window.locator('button[type="submit"]')

// Por clase
window.locator('.btn-primary')

// Por placeholder
window.locator('input[placeholder="Nombre"]')

// Primer/último elemento
window.locator('a').first()
window.locator('a').last()

// Por índice
window.locator('tr').nth(2)

// Esperar elemento
await window.waitForSelector('.page-title')

// Verificar texto
await expect(window.locator('h1')).toContainText('Dashboard')

// Verificar visible
await expect(window.locator('.sidebar')).toBeVisible()
```

---

## 📊 **Reportes HTML**

Después de ejecutar tests:

```bash
npm run test:report
```

Esto abre un reporte HTML interactivo con:
- ✅ Lista de todos los tests
- ✅ Duración de cada uno
- ✅ Screenshots
- ✅ Videos de fallos
- ✅ Logs de consola
- ✅ Traces detallados

---

## 🎯 **Ejemplo de Salida**

```bash
$ npm test

Running 17 tests using 1 worker

  01-login.spec.js
    ✓ TC001 - Login exitoso (5.2s)
    ✓ TC002 - Login falla con inválidas (3.1s)
    ✓ TC003 - Sesión persiste (4.8s)

  02-dashboard.spec.js
    ✓ TC004 - Dashboard muestra estadísticas (6.5s)
    ✓ TC005 - Botón actualizar (3.2s)
    ✓ TC006 - Gráficos se renderizan (4.1s)

  03-clientes.spec.js
    ✓ TC007 - Navegar a Clientes (2.8s)
    ✓ TC008 - Abrir modal (3.5s)
    ✓ TC009 - Crear cliente (7.2s)
    ✓ TC010 - Búsqueda funciona (4.1s)

  04-reportes.spec.js
    ✓ TC011 - Reportes accesible (3.2s)
    ✓ TC012 - Tickets disponible (3.8s)
    ✓ TC013 - Generar reporte clientes (5.5s)
    ✓ TC014 - Botones exportar/imprimir (2.9s)

  05-permisos.spec.js
    ✓ TC015 - Admin ve todos módulos (4.2s)
    ✓ TC016 - Usuario limitado (5.1s)
    ✓ TC017 - Módulos protegidos (8.3s)

  17 passed (1.5m)

To open last HTML report run:
  npm run test:report
```

---

## ⚡ **Tips de Performance**

### **Tests Más Rápidos:**
```javascript
// Reducir timeouts donde sea posible
await window.waitForTimeout(500); // En lugar de 2000

// Usar waitForSelector en lugar de timeout fijo
await window.waitForSelector('.page-title');

// Reutilizar la app entre tests (si es seguro)
```

### **Debugging Más Eficiente:**
```bash
# Ejecutar solo un test
npx playwright test tests/01-login.spec.js --grep "TC001"

# Ver en tiempo real
npx playwright test --headed

# Pausar en punto específico
await page.pause(); // En el código del test
```

---

## 🎉 **¡Listo para Usar!**

**Ejecuta ahora mismo:**
```bash
npm test
```

**Esto probará tu aplicación Electron REAL con todos sus componentes funcionando.** 🚀

---

**Fecha:** 11 de Octubre, 2025  
**Estado:** ✅ Configurado y Listo  
**Total Tests:** 17

