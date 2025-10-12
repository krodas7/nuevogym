# 🐍 Solución: Error "No module named 'distutils'" en Windows

## ❌ Error que Viste:

```
ModuleNotFoundError: No module named 'distutils'
gyp ERR! configure error
```

---

## ✅ **Solución Inmediata (Sin Compilar)**

El problema es que Python 3.13 no tiene `distutils`. **PERO NO LO NECESITAS** si usas binarios pre-compilados.

### **Ejecuta Esto (Copia y Pega):**

```cmd
cd C:\Users\kevin\OneDrive\Desktop\nuevogym

REM Limpiar completamente
rmdir /s /q node_modules
del /q package-lock.json

REM Instalar SIN compilar (usa binarios pre-compilados)
set npm_config_build_from_source=false
set PREBUILD_INSTALL_FORCE_DOWNLOAD=true
npm install --legacy-peer-deps --ignore-scripts

REM Después instalar better-sqlite3 pre-compilado
npm install better-sqlite3 --legacy-peer-deps --no-save

REM Compilar frontend
npm run build

REM Iniciar
npm start
```

---

## 🎯 **Solución Alternativa: Usar Python 3.12**

Si necesitas compilar desde código fuente:

### **Opción 1: Instalar Python 3.12**

```cmd
REM 1. Desinstalar Python 3.13
REM    Ve a: Configuración > Aplicaciones > Python 3.13 > Desinstalar

REM 2. Descargar Python 3.12
REM    Ve a: https://www.python.org/downloads/release/python-31211/
REM    Descarga: Windows installer (64-bit)

REM 3. Instalar Python 3.12
REM    ✅ Marca "Add Python to PATH"
REM    Instala normalmente

REM 4. Verificar
python --version
REM Debería mostrar: Python 3.12.x

REM 5. Intentar de nuevo
cd C:\Users\kevin\OneDrive\Desktop\nuevogym
npm install --legacy-peer-deps
npm run build
npm start
```

---

### **Opción 2: Instalar distutils en Python 3.13**

```cmd
REM Instalar setuptools (incluye distutils)
pip install setuptools

REM Intentar de nuevo
cd C:\Users\kevin\OneDrive\Desktop\nuevogym
npm install --legacy-peer-deps
npm run build
npm start
```

---

## 🚀 **Solución MÁS RÁPIDA (RECOMENDADA)**

**Usa INSTALAR-SIN-COMPILAR.bat:**

```cmd
cd C:\Users\kevin\OneDrive\Desktop\nuevogym

REM Actualizar desde GitHub
git pull

REM Ejecutar instalador sin compilación
INSTALAR-SIN-COMPILAR.bat
```

Este script:
- ✅ NO requiere Python
- ✅ NO requiere Visual Studio
- ✅ USA binarios pre-compilados
- ✅ Funciona en cualquier Windows

---

## 📝 **Script Manual (Si No Existe el .bat)**

Crea un archivo `instalar-rapido.bat`:

```batch
@echo off
cd C:\Users\kevin\OneDrive\Desktop\nuevogym

rmdir /s /q node_modules 2>nul
del /q package-lock.json 2>nul

set npm_config_build_from_source=false
set PREBUILD_INSTALL_FORCE_DOWNLOAD=true

npm install --legacy-peer-deps --ignore-scripts
npm install better-sqlite3 --legacy-peer-deps --no-save
npm install serialport --legacy-peer-deps --no-save

npm run build
npm start

pause
```

Ejecuta:
```cmd
instalar-rapido.bat
```

---

## 🔍 **¿Por Qué Pasa Este Error?**

### **Causa Raíz:**

1. **Python 3.13** eliminó el módulo `distutils`
2. `node-gyp` (herramienta de compilación) aún usa `distutils`
3. Al intentar compilar `better-sqlite3`, falla

### **Soluciones:**

| Solución | Dificultad | Tiempo |
|----------|------------|--------|
| Usar binarios pre-compilados | ⭐ Fácil | 3 min |
| Instalar Python 3.12 | ⭐⭐ Media | 10 min |
| Instalar setuptools | ⭐⭐ Media | 5 min |
| Compilar en otra PC | ⭐⭐⭐ Difícil | - |

---

## ✅ **Comando Final (Todo en Uno)**

**COPIA Y PEGA ESTO EN CMD:**

```cmd
cd C:\Users\kevin\OneDrive\Desktop\nuevogym && rmdir /s /q node_modules 2>nul && del /q package-lock.json 2>nul && set npm_config_build_from_source=false && set PREBUILD_INSTALL_FORCE_DOWNLOAD=true && npm install --legacy-peer-deps --ignore-scripts && npm install better-sqlite3 --legacy-peer-deps --no-save && npm install serialport --legacy-peer-deps --no-save && npm run build && echo. && echo ✅ INSTALACION COMPLETADA && echo. && npm start
```

---

## ⚠️ **Problema de OneDrive**

El error `EPERM: operation not permitted` también indica que **OneDrive está bloqueando archivos**.

### **Solución:**

**Mueve el proyecto FUERA de OneDrive:**

```cmd
REM 1. Copiar a C:\
xcopy C:\Users\kevin\OneDrive\Desktop\nuevogym C:\nuevogym /E /I /H

REM 2. Ir a la nueva ubicación
cd C:\nuevogym

REM 3. Instalar
set npm_config_build_from_source=false
npm install --legacy-peer-deps --ignore-scripts
npm install better-sqlite3 --legacy-peer-deps --no-save

REM 4. Compilar
npm run build

REM 5. Iniciar
npm start
```

---

## 🎯 **Recomendación Final**

### **Opción A: Método Rápido (3 minutos)**
```cmd
1. Copiar proyecto a C:\nuevogym
2. Ejecutar comando todo-en-uno (arriba)
3. Listo
```

### **Opción B: Método Correcto (10 minutos)**
```cmd
1. Instalar Python 3.12
2. Copiar proyecto a C:\nuevogym
3. npm install --legacy-peer-deps
4. npm run build
5. npm start
```

---

## 📞 **Prueba Esto AHORA:**

```cmd
cd C:\Users\kevin\OneDrive\Desktop\nuevogym
pip install setuptools
npm install --legacy-peer-deps
```

Si funciona:
```cmd
npm run build
npm start
```

Si NO funciona:
```cmd
REM Usar el comando todo-en-uno de arriba
```

---

**¿Cuál método quieres intentar? Te recomiendo el comando todo-en-uno.** 🚀

