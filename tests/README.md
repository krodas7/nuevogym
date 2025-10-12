# 🧪 Tests Automatizados con Playwright for Electron

## 📋 **Descripción**

Tests E2E (End-to-End) automáticos para NuevoGym usando Playwright for Electron.

**A diferencia de TestSprite**, Playwright SÍ puede probar aplicaciones Electron porque:
- ✅ Inicia el proceso completo de Electron
- ✅ Tiene acceso a `window.electronAPI`
- ✅ Puede interactuar con IPC
- ✅ Prueba la aplicación REAL (no solo el frontend)

---

## 🚀 **Ejecutar Tests**

### **Todos los Tests:**
```bash
npx playwright test
```

### **Un Test Específico:**
```bash
npx playwright test tests/01-login.spec.js
```

### **Con UI Interactiva:**
```bash
npx playwright test --ui
```

### **En Modo Debug:**
```bash
npx playwright test --debug
```

---

## 📁 **Tests Disponibles**

| Archivo | Descripción | Tests |
|---------|-------------|-------|
| `01-login.spec.js` | Login y autenticación | 3 tests |
| `02-dashboard.spec.js` | Dashboard y estadísticas | 3 tests |
| `03-clientes.spec.js` | Gestión de clientes | 4 tests |
| `04-reportes.spec.js` | Sistema de reportes | 4 tests |
| `05-permisos.spec.js` | Control de acceso por roles | 3 tests |

**Total: 17 tests automatizados** ✅

---

## 📊 **Resultados**

### **Después de Ejecutar:**

Los resultados se guardan en:
- `playwright-report/` - Reporte HTML interactivo
- `tests/screenshots/` - Screenshots de cada test
- `test-results/` - Videos de tests fallidos

### **Ver Reporte:**
```bash
npx playwright show-report
```

---

## 🎯 **Cobertura de Tests**

### **Login (01-login.spec.js):**
- ✅ Login exitoso con credenciales válidas
- ✅ Login falla con credenciales inválidas
- ✅ Sesión persiste en localStorage

### **Dashboard (02-dashboard.spec.js):**
- ✅ Muestra estadísticas correctamente
- ✅ Botón actualizar funciona
- ✅ Gráficos se renderizan

### **Clientes (03-clientes.spec.js):**
- ✅ Navegar al módulo
- ✅ Abrir modal de nuevo cliente
- ✅ Crear cliente nuevo
- ✅ Búsqueda funciona

### **Reportes (04-reportes.spec.js):**
- ✅ Módulo es accesible
- ✅ Reporte de Tickets disponible
- ✅ Generar reporte de clientes
- ✅ Botones de exportar e imprimir

### **Permisos (05-permisos.spec.js):**
- ✅ Admin ve todos los módulos
- ✅ Usuario limitado (verificación de sidebar)
- ✅ Módulos protegidos funcionan

---

## ⚙️ **Configuración**

### **playwright.config.js:**
```javascript
- Timeout: 60 segundos por test
- Workers: 1 (sin paralelismo, Electron no lo soporta bien)
- Screenshots: Solo en fallos
- Videos: Solo en fallos
- Retries: 0 en local, 2 en CI
```

---

## 🐛 **Debugging**

### **Si un Test Falla:**

1. **Ver el error en consola**
2. **Revisar screenshot:** `tests/screenshots/[nombre-test].png`
3. **Ver video:** `test-results/[test-name]/video.webm`
4. **Ejecutar en modo debug:**
   ```bash
   npx playwright test tests/[archivo].spec.js --debug
   ```

### **Ejecutar Step by Step:**
```bash
npx playwright test --debug
```

Esto abrirá Playwright Inspector donde puedes:
- ⏯️ Pausar/continuar
- ⏭️ Step by step
- 🔍 Inspeccionar elementos
- 📝 Ver console logs

---

## 🎨 **Screenshots**

Todos los tests toman screenshots automáticamente en:
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

## 📋 **Agregar Nuevos Tests**

### **Template:**

```javascript
const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

test.describe('Nombre del Módulo', () => {
  let electronApp;
  let window;

  test.beforeEach(async () => {
    // Iniciar Electron
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../electron/main.js')]
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

  test('Tu test aquí', async () => {
    // Tu código de test
    await expect(window.locator('.algo')).toBeVisible();
  });
});
```

---

## 🔄 **CI/CD Integration**

### **GitHub Actions ya está configurado:**

Los workflows en `.github/workflows/` pueden ejecutar estos tests:

```yaml
- name: Run Playwright tests
  run: npx playwright test
  
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

---

## ✅ **Ventajas de Playwright vs TestSprite**

| Aspecto | TestSprite | Playwright |
|---------|------------|------------|
| **Soporta Electron** | ❌ No | ✅ Sí |
| **Acceso a electronAPI** | ❌ No | ✅ Sí |
| **Prueba .exe** | ❌ No | ✅ Sí |
| **Screenshots** | ✅ Sí | ✅ Sí |
| **Videos** | ✅ Sí | ✅ Sí |
| **Debugging** | ⚠️ Limitado | ✅ Excelente |
| **CI/CD** | ✅ Sí | ✅ Sí |
| **Configuración** | ⭐ Fácil | ⭐⭐ Media |

---

## 🎯 **Casos de Uso**

### **Desarrollo:**
```bash
# Hacer cambios en el código
# Ejecutar tests para verificar que no rompiste nada
npx playwright test
```

### **Pre-Release:**
```bash
# Ejecutar suite completa
npx playwright test

# Ver reporte
npx playwright show-report

# Si todo pasa → Crear release
```

### **CI/CD:**
```bash
# GitHub Actions ejecuta automáticamente
# Si tests pasan → Sube instalador
# Si tests fallan → Notifica y no sube
```

---

## 📝 **Próximos Tests a Agregar**

Puedes expandir con:

- Tests de membresías
- Tests de asistencias
- Tests de renovación con tickets
- Tests de configuración
- Tests de backup/restore
- Tests de búsqueda avanzada
- Tests de paginación
- Tests de tema claro/oscuro

---

**Fecha:** 11 de Octubre, 2025  
**Framework:** Playwright 1.x  
**Target:** Electron 28.x  
**Total Tests:** 17

