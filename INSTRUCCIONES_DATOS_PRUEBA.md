# 🎲 Insertar Datos de Prueba en NuevoGym

## 📊 **¿Qué son los Datos de Prueba?**

Los datos de prueba incluyen:
- **8 Clientes** con diferentes tipos de membresías
- **24 Tickets** distribuidos en los últimos 3 meses
- **Montos realistas** según tipo de membresía
- **Métodos de pago variados** (Efectivo y Transferencia)
- **Tipos de ticket variados** (Renovación, Nuevo Cliente, Pago)

---

## 🚀 **Método 1: Desde la Aplicación (RECOMENDADO)**

### **Paso 1: Abrir NuevoGym**
```
npm start
```
(O abre la aplicación instalada)

### **Paso 2: Ir a Configuración**
1. En el sidebar, haz clic en **Configuración**
2. Desplázate hasta la sección **"Respaldo de Base de Datos"**

### **Paso 3: Insertar Datos**
1. Haz clic en el botón **"🎲 Insertar Datos de Prueba"**
2. Confirma la acción en el diálogo
3. Espera el mensaje de éxito
4. La página se recargará automáticamente

### **Paso 4: Ver los Datos**
1. Ve al módulo **Clientes** → Verás 8 clientes
2. Ve al módulo **Reportes** → Selecciona **"🎫 Tickets Generados"**
3. Elige el mes actual o meses anteriores
4. Haz clic en **"📊 Generar Reporte"**

---

## 📊 **Datos que se Insertarán**

### **Clientes:**
- Juan Pérez (12345678)
- María López (23456789)
- Carlos García (34567890)
- Ana Martínez (45678901)
- Luis Rodríguez (56789012)
- Sofia Hernández (67890123)
- Pedro González (78901234)
- Laura Díaz (89012345)

### **Distribución de Tickets:**

#### **Mes Actual:**
- 8 tickets
- Tipos: Renovación, Nuevo Cliente, Pago
- Métodos: Efectivo / Transferencia

#### **Hace 1 Mes:**
- 8 tickets
- Distribución similar

#### **Hace 2 Meses:**
- 8 tickets
- Distribución similar

### **Montos según Membresía:**
- **Mensual:** Q150.00
- **Trimestral:** Q400.00
- **Semestral:** Q750.00
- **Anual:** Q1,300.00

---

## 🔍 **Método 2: Usando SQL Directo**

### **Paso 1: Generar el archivo SQL**
```bash
cd /Users/krodas7/Desktop/nuevogym
node agregar-datos-prueba-sql.js
```

Esto creará el archivo `datos-prueba.sql`

### **Paso 2: Aplicar el SQL**

**Opción A: Usando sqlite3 en terminal**
```bash
sqlite3 ~/Library/Application\ Support/nuevogym/nuevogym.db < datos-prueba.sql
```

**Opción B: Usando un cliente SQLite**
1. Abre DB Browser for SQLite (o tu cliente preferido)
2. Abre la base de datos: `~/Library/Application Support/nuevogym/nuevogym.db`
3. Ve a "Execute SQL"
4. Pega el contenido de `datos-prueba.sql`
5. Ejecuta el script

---

## ✅ **Verificar que Funcionó**

### **1. Dashboard**
```
- Total Clientes: 8+
- Ingresos Mensuales: Q1,000+ (aprox)
- Asistencias: 0 (hasta que registres asistencias)
```

### **2. Clientes**
```
Deberías ver 8 clientes con:
- Nombres completos
- Teléfonos
- Diferentes tipos de membresías
- Fechas de vencimiento variadas
```

### **3. Reportes → Tickets Generados**

**Mes Actual:**
```
- Total Tickets: 8
- Total Ingresos: Q3,000 - Q6,000 (varía según membresías)
- Tickets por Tipo: Renovación (mayoría)
- Métodos: Efectivo / Transferencia
```

**Meses Anteriores:**
```
- Similar distribución
- Puedes ver el historial completo
```

---

## 🎯 **Casos de Uso Reales**

### **1. Demostración del Sistema**
```
- Muestra a clientes potenciales cómo funciona
- Presenta reportes con datos realistas
- Demuestra filtros y búsquedas
```

### **2. Pruebas de Funcionalidad**
```
- Verifica que los reportes calculan correctamente
- Prueba exportación a CSV
- Prueba impresión de reportes
```

### **3. Capacitación**
```
- Entrena a nuevos usuarios
- Explica el flujo de trabajo
- Practica renovaciones y pagos
```

### **4. Desarrollo**
```
- Prueba nuevas funcionalidades
- Verifica rendimiento con datos
- Depura problemas con escenarios reales
```

---

## 🧹 **Limpiar Datos de Prueba**

Si deseas eliminar los datos de prueba:

### **Opción 1: Backup y Restaurar**
1. Ve a **Configuración** → **Respaldo de Base de Datos**
2. Haz un backup ANTES de insertar datos de prueba
3. Para limpiar: **Restaurar desde Backup**

### **Opción 2: SQL Manual**
```bash
sqlite3 ~/Library/Application\ Support/nuevogym/nuevogym.db

DELETE FROM tickets WHERE numero_ticket BETWEEN 1 AND 24;
DELETE FROM clientes WHERE telefono IN ('12345678', '23456789', '34567890', '45678901', '56789012', '67890123', '78901234', '89012345');
```

### **Opción 3: Resetear Base de Datos**
```bash
# Eliminar la base de datos actual
rm ~/Library/Application\ Support/nuevogym/nuevogym.db

# Al iniciar NuevoGym, se creará una nueva base de datos vacía
```

---

## ⚠️ **Notas Importantes**

1. **Números de Ticket**: Empiezan desde 1 si es una base de datos nueva
2. **Fechas**: Los tickets se generan con fechas aleatorias en los últimos 3 meses
3. **Clientes**: Se asignan membresías aleatorias a cada cliente
4. **No Duplicados**: El script usa `INSERT OR IGNORE` para evitar duplicados

---

## 💡 **Tips**

### **Para Presentaciones:**
```
1. Inserta datos de prueba
2. Ve a Dashboard → Muestra estadísticas
3. Ve a Reportes → Genera reporte del mes actual
4. Exporta a CSV → Muestra en Excel
5. Imprime un reporte → Muestra formato físico
```

### **Para Testing:**
```
1. Inserta datos
2. Prueba filtros por mes
3. Verifica cálculos de totales
4. Prueba exportación
5. Verifica formato de impresión
```

### **Para Capacitación:**
```
1. Inserta datos
2. Muestra el flujo completo
3. Explica cada módulo con ejemplos
4. Deja que practiquen con datos reales
```

---

## 📞 **Soporte**

Si tienes problemas al insertar datos de prueba:

1. **Verifica que la base de datos existe**
   ```bash
   ls -la ~/Library/Application\ Support/nuevogym/nuevogym.db
   ```

2. **Verifica permisos**
   ```bash
   chmod 644 ~/Library/Application\ Support/nuevogym/nuevogym.db
   ```

3. **Revisa los logs en la consola de Electron**
   - Presiona `Ctrl+Shift+I` en la aplicación
   - Ve a la pestaña **Console**
   - Busca mensajes de error

---

## ✅ **Checklist de Verificación**

Después de insertar datos de prueba, verifica:

- [ ] ✅ Dashboard muestra clientes nuevos
- [ ] ✅ Módulo Clientes lista los 8 clientes
- [ ] ✅ Reportes → Tickets muestra tickets del mes actual
- [ ] ✅ Los montos corresponden a las membresías
- [ ] ✅ Los filtros por mes funcionan correctamente
- [ ] ✅ La exportación CSV contiene todos los datos
- [ ] ✅ La impresión se ve correcta

---

**Fecha:** 11 de Octubre, 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Funcional

