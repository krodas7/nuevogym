# 🎨 INSTRUCCIONES PARA AGREGAR TUS LOGOS

## 📍 Ubicación de los Logos:

Coloca tus imágenes en esta carpeta:
```
/Users/krodas7/Desktop/nuevogym/public/images/
```

## 🖼️ Logos Necesarios:

### 1️⃣ **Logo del Sidebar** (Menú Lateral)

**Nombre del archivo**: `logo-sidebar.png`

**Ruta completa**:
```
/Users/krodas7/Desktop/nuevogym/public/images/logo-sidebar.png
```

**Especificaciones:**
- Tamaño: 150x150 píxeles (cuadrado)
- Formato: PNG con fondo transparente
- Uso: Aparece en la parte superior del menú lateral
- Colores: Preferiblemente blancos o claros (el fondo es azul)

---

### 2️⃣ **Logo de los Tickets** (Comprobantes Impresos)

**Nombre del archivo**: `logo-ticket.png`

**Ruta completa**:
```
/Users/krodas7/Desktop/nuevogym/public/images/logo-ticket.png
```

**Especificaciones:**
- Tamaño: 200x200 píxeles (cuadrado)
- Formato: PNG o JPG
- Uso: Aparece en todos los tickets impresos
- Nota: Se verá en blanco y negro en impresoras térmicas
- Recomendación: Logo simple y claro

---

### 3️⃣ **Logo de Login** (Opcional)

**Nombre del archivo**: `logo-login.png`

**Ruta completa**:
```
/Users/krodas7/Desktop/nuevogym/public/images/logo-login.png
```

**Especificaciones:**
- Tamaño: 200x200 píxeles
- Formato: PNG con fondo transparente
- Uso: Pantalla de inicio de sesión
- Puede ser más grande que los otros

---

## 🚀 Pasos para Agregar tus Logos:

### Opción 1: Desde Finder (Mac)

1. Abre **Finder**
2. Presiona **Cmd + Shift + G**
3. Pega esta ruta:
   ```
   /Users/krodas7/Desktop/nuevogym/public/images/
   ```
4. Presiona **Enter**
5. **Arrastra** tus imágenes a esta carpeta
6. **Renombra** las imágenes exactamente como:
   - `logo-sidebar.png`
   - `logo-ticket.png`
   - `logo-login.png`

### Opción 2: Desde Terminal

```bash
# Navega a la carpeta
cd /Users/krodas7/Desktop/nuevogym/public/images/

# Copia tus logos (ajusta las rutas según donde estén tus archivos)
cp ~/Downloads/mi-logo.png logo-sidebar.png
cp ~/Downloads/mi-logo.png logo-ticket.png
cp ~/Downloads/mi-logo.png logo-login.png
```

---

## ✅ Verificación:

Después de colocar los logos, verifica que estén en su lugar:

```bash
ls -lh /Users/krodas7/Desktop/nuevogym/public/images/
```

Deberías ver:
```
logo-sidebar.png
logo-ticket.png
logo-login.png (opcional)
```

---

## 🔄 Aplicar los Cambios:

1. **Guarda** tus imágenes en la carpeta
2. **Recarga** la aplicación:
   - Si está corriendo: Presiona **Ctrl+R** (Windows) o **Cmd+R** (Mac)
   - O cierra y vuelve a abrir: `npm start`
3. **¡Listo!** Tus logos aparecerán automáticamente

---

## ⚠️ Notas Importantes:

- **Nombres exactos**: Los archivos deben llamarse EXACTAMENTE como se indica
- **Extensión PNG**: Preferible para mejor calidad
- **Sin espacios**: No uses espacios en los nombres
- **Tamaño de archivo**: Mantén las imágenes < 500KB cada una
- **Sin mayúsculas**: Todos los nombres en minúsculas

---

## 🎨 Ejemplo de Logo Recomendado:

Para el **logo del sidebar**:
- Icono de gimnasio, pesas, o inicial del gimnasio
- Colores claros que contrasten con azul
- Fondo transparente
- Estilo minimalista

Para el **logo del ticket**:
- Puede ser el mismo logo
- Asegúrate de que se vea bien en blanco y negro
- Bordes definidos

---

## 📞 ¿Necesitas Ayuda?

Si tus logos no aparecen:
1. Verifica los nombres de archivo
2. Verifica que estén en la carpeta correcta
3. Recarga la aplicación (Cmd+R)
4. Revisa la consola por errores

---

**¡Coloca tus logos y tendrás una aplicación 100% personalizada para tu gimnasio!** 💪

