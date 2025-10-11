# 🔧 Solución: Error "vite no encontrado" en Windows

## ❌ Error que Viste:

```
Error: Cannot find module 'vite'
❌ Error al compilar frontend
```

---

## ✅ Solución Paso a Paso

### **Opción 1: Script Automático (MÁS FÁCIL)**

Simplemente ejecuta este comando en CMD:

```cmd
OPTIMIZAR-WINDOWS.bat
```

Espera 3-5 minutos y luego:

```cmd
INICIAR-NUEVOGYM.bat
```

---

### **Opción 2: Paso a Paso Manual**

Si el script no funciona, hazlo manualmente:

#### **Paso 1: Abrir CMD como Administrador**
```
1. Presiona Windows + X
2. Selecciona "Símbolo del sistema (Administrador)" o "Windows PowerShell (Administrador)"
3. Clic en Sí
```

#### **Paso 2: Ir a la Carpeta del Proyecto**
```cmd
cd C:\Users\itgym\OneDrive\Escritorio\nuevogym
```

#### **Paso 3: Limpiar Todo**
```cmd
rmdir /s /q node_modules
rmdir /s /q dist
rmdir /s /q dist-electron
del /q package-lock.json
```

Cuando te pregunte "¿Estás seguro? (S/N)", escribe `S` y presiona Enter.

#### **Paso 4: Instalar Dependencias**
```cmd
npm install --legacy-peer-deps
```

⏱️ **Esto tomará 2-3 minutos.** Verás muchas líneas bajando.

Espera hasta que veas:
```
added XXX packages
```

#### **Paso 5: Recompilar Módulos Nativos**
```cmd
npm install --save-dev electron-rebuild
npx electron-rebuild -f -w better-sqlite3
```

Si da error, intenta:
```cmd
npm rebuild better-sqlite3 --build-from-source
```

#### **Paso 6: Compilar Frontend**
```cmd
npm run build
```

Deberías ver:
```
✓ built in XXXms
```

#### **Paso 7: Iniciar Aplicación**
```cmd
npm start
```

---

## 🎯 Script de Una Línea (Copia y Pega)

Abre CMD como Administrador y pega esto:

```cmd
cd C:\Users\itgym\OneDrive\Escritorio\nuevogym && rmdir /s /q node_modules 2>nul & rmdir /s /q dist 2>nul & del /q package-lock.json 2>nul & npm install --legacy-peer-deps && npm run build && npm start
```

---

## ⚠️ Problemas Específicos

### **Error: "Cannot find module 'vite'"**
**Causa:** `node_modules` no está instalado o está incompleto.

**Solución:**
```cmd
npm install --legacy-peer-deps
```

### **Error: "electron-rebuild no se reconoce"**
**Causa:** `electron-rebuild` no está instalado.

**Solución:**
```cmd
npm install --save-dev electron-rebuild
npm install --save-dev @electron/rebuild
npx electron-rebuild
```

### **Error: "better-sqlite3 no se puede compilar"**
**Causa:** Faltan herramientas de compilación de Windows.

**Solución:**
```cmd
npm install --global windows-build-tools
npm rebuild better-sqlite3 --build-from-source
```

### **Error: "EPERM: operation not permitted"**
**Causa:** Necesitas permisos de administrador.

**Solución:**
1. Cierra CMD
2. Ábrelo como Administrador (clic derecho → Ejecutar como administrador)
3. Intenta de nuevo

---

## 📋 Checklist de Verificación

Antes de iniciar, verifica:

- [ ] ✅ Node.js instalado (`node --version`)
- [ ] ✅ npm instalado (`npm --version`)
- [ ] ✅ Estás en la carpeta correcta (`cd C:\Users\itgym\OneDrive\Escritorio\nuevogym`)
- [ ] ✅ CMD está como Administrador
- [ ] ✅ Tienes internet (para descargar dependencias)

---

## 🚀 Orden Correcto de Ejecución

```
1. Clonar/Descargar proyecto ✅ (Ya lo hiciste)
2. Abrir CMD como Administrador
3. cd C:\Users\itgym\OneDrive\Escritorio\nuevogym
4. npm install --legacy-peer-deps
5. npm run build
6. npm start
```

---

## 💡 Script Mejorado para Windows

He actualizado `INICIAR-NUEVOGYM.bat` para que:

1. ✅ Detecte si Node.js está instalado
2. ✅ Instale dependencias automáticamente si no existen
3. ✅ Compile el frontend si no existe
4. ✅ Recompile better-sqlite3 si es necesario
5. ✅ Muestre mensajes claros de lo que está haciendo

**Simplemente ejecuta:**
```cmd
INICIAR-NUEVOGYM.bat
```

Y espera. El script hará todo automáticamente.

---

## 📞 Si Nada Funciona

Si después de seguir todos los pasos aún tienes problemas:

### **Opción A: Reinstalación Completa**

```cmd
REM 1. Ir a la carpeta
cd C:\Users\itgym\OneDrive\Escritorio

REM 2. Eliminar carpeta completa
rmdir /s /q nuevogym

REM 3. Clonar de nuevo
git clone https://github.com/krodas7/nuevogym.git

REM 4. Entrar
cd nuevogym

REM 5. Ejecutar script
OPTIMIZAR-WINDOWS.bat
```

### **Opción B: Descargar ZIP Nuevo**

```
1. Ve a: https://github.com/krodas7/nuevogym
2. Clic en "Code" → "Download ZIP"
3. Extrae en C:\nuevogym (no en OneDrive, mejor en C:\ directo)
4. Abre CMD como Administrador
5. cd C:\nuevogym
6. OPTIMIZAR-WINDOWS.bat
```

---

## 🎯 Ruta Recomendada

En lugar de:
```
C:\Users\itgym\OneDrive\Escritorio\nuevogym
```

Usa:
```
C:\nuevogym
```

**OneDrive a veces causa problemas con node_modules.**

Para mover:
```cmd
xcopy C:\Users\itgym\OneDrive\Escritorio\nuevogym C:\nuevogym /E /I /H
cd C:\nuevogym
OPTIMIZAR-WINDOWS.bat
```

---

## ✅ Resultado Esperado

Cuando funcione correctamente, verás:

```
========================================
  NUEVOGYM - SISTEMA DE GESTION
========================================

🚀 Iniciando aplicación...

✅ Node.js detectado:
v20.10.0

✅ Dependencias verificadas
✅ Frontend compilado
✅ TODO LISTO

📌 CREDENCIALES:
   Usuario: admin
   Contraseña: admin123

🔴 Para detener: Presiona Ctrl+C

Iniciando en 3 segundos...
```

Y luego se abrirá la ventana de Electron con la aplicación.

---

**¿El problema persiste? Dime exactamente qué mensaje de error ves y en qué paso.** 🚀

