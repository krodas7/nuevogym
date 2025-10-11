# 🔐 Sistema de Permisos por Rol

## 📋 **Descripción**

NuevoGym implementa un sistema de permisos basado en roles que controla qué módulos puede ver y usar cada usuario.

---

## 👥 **Roles Disponibles**

### **1. Administrador (admin)**
👑 **Acceso total al sistema**

✅ **Puede acceder a:**
- Dashboard
- Clientes
- Asistencias
- Tipos de Membresía
- Renovar Membresías
- Reportes
- Usuarios
- Configuración

✅ **Puede hacer:**
- Crear, editar y eliminar clientes
- Registrar asistencias
- Crear y modificar tipos de membresía
- Renovar membresías
- Generar todos los reportes
- Crear y gestionar usuarios
- Cambiar configuración del sistema
- Hacer backup y restaurar base de datos
- Configurar sensor de huellas
- Configurar Arduino

---

### **2. Usuario (usuario)**
👤 **Acceso limitado (operaciones básicas)**

✅ **PUEDE acceder a:**
- ✅ **Clientes** - Ver, crear, editar clientes
- ✅ **Tipos de Membresía** - Ver tipos disponibles
- ✅ **Renovar Membresías** - Renovar membresías de clientes existentes

❌ **NO puede acceder a:**
- ❌ Dashboard
- ❌ Asistencias
- ❌ Reportes
- ❌ Usuarios
- ❌ Configuración

✅ **Puede hacer:**
- Registrar nuevos clientes
- Ver listado de clientes
- Editar información de clientes
- Ver tipos de membresía disponibles
- Renovar membresías de clientes
- Generar tickets de renovación
- Generar tickets de nuevo cliente

❌ **NO puede hacer:**
- Ver estadísticas del gimnasio
- Registrar asistencias manualmente
- Generar reportes
- Crear otros usuarios
- Cambiar configuración
- Hacer backups
- Configurar hardware

---

## 🎯 **Casos de Uso**

### **Administrador:**
```
Rol ideal para:
- Dueño del gimnasio
- Gerente general
- Persona de confianza

Necesita acceso a:
- Estadísticas financieras
- Reportes completos
- Configuración del sistema
- Gestión de usuarios
```

### **Usuario:**
```
Rol ideal para:
- Recepcionista
- Instructor con funciones administrativas
- Empleado de mostrador

Necesita acceso a:
- Registrar clientes nuevos
- Renovar membresías
- Consultar información de clientes
```

---

## 📊 **Comparación de Permisos**

| Módulo | Admin 👑 | Usuario 👤 |
|--------|----------|------------|
| **Dashboard** | ✅ | ❌ |
| **Clientes** | ✅ | ✅ |
| **Asistencias** | ✅ | ❌ |
| **Tipos Membresía** | ✅ | ✅ |
| **Renovar Membresías** | ✅ | ✅ |
| **Reportes** | ✅ | ❌ |
| **Usuarios** | ✅ | ❌ |
| **Configuración** | ✅ | ❌ |

---

## 🔧 **Cómo Funciona**

### **1. Al Iniciar Sesión**
```javascript
// El sistema guarda el rol del usuario
{
  usuario: "recepcionista",
  nombre_completo: "María García",
  rol: "usuario"  ← Esto define los permisos
}
```

### **2. En el Sidebar**
```javascript
// Solo se muestran los módulos permitidos
{tienePermiso('dashboard') && (
  <NavLink to="/">Dashboard</NavLink>
)}
```

### **3. En las Rutas**
```javascript
// Si intenta acceder a una ruta sin permiso, lo redirige
<Route 
  path="reportes" 
  element={tienePermiso('reportes') ? <Reportes /> : <Navigate to="/" />} 
/>
```

### **4. Visual en Sidebar**
```
┌─────────────────────────┐
│ María García            │
│ @recepcionista          │
│ 👤 Usuario              │ ← Muestra el rol
└─────────────────────────┘
```

---

## 👥 **Crear Usuarios con Diferentes Roles**

### **Como Administrador:**

1. **Ir a módulo "Usuarios"**
2. **Clic en "+ Nuevo Usuario"**
3. **Llenar formulario:**
   ```
   Usuario: recepcionista
   Contraseña: ********
   Nombre Completo: María García
   Rol: [Usuario] ← Seleccionar aquí
   Estado: Activo
   ```
4. **Guardar**

### **El nuevo usuario podrá:**
- Iniciar sesión con sus credenciales
- Ver SOLO los módulos permitidos (Clientes, Membresías, Renovar)
- No verá Dashboard, Reportes, Usuarios ni Configuración

---

## 🎯 **Ejemplo de Uso Real**

### **Escenario: Gimnasio con Recepcionista**

**Dueño (Administrador):**
```
Horario: 6am - 10am y 4pm - 8pm
Acceso: TODO el sistema
Puede: Ver reportes, hacer cuadres, configurar hardware
```

**Recepcionista (Usuario):**
```
Horario: 10am - 4pm
Acceso: Clientes, Membresías, Renovar
Puede: Atender clientes, renovar membresías
No puede: Ver ingresos, cambiar configuración
```

**Ventajas:**
- ✅ Recepcionista no ve información financiera sensible
- ✅ Recepcionista no puede cambiar configuración
- ✅ Recepcionista no puede crear otros usuarios
- ✅ Dueño mantiene control total
- ✅ Cada acción queda registrada con el usuario que la hizo

---

## 🔐 **Seguridad Adicional**

### **Auditoría de Acciones**
Todas las acciones importantes quedan registradas:
```sql
tabla: auditoria
- usuario_id: 2
- usuario_nombre: "María García"
- accion: "crear_cliente"
- modulo: "Clientes"
- detalles: "Cliente: Juan Pérez"
- fecha_hora: "2025-10-11 14:30:00"
```

### **Ver Auditoría:**
```
Solo el Administrador puede ver el log de auditoría
en la tabla 'auditoria' de la base de datos.
```

---

## 🎨 **Interfaz según Rol**

### **Administrador ve:**
```
Sidebar:
├── 📊 Dashboard
├── 👥 Clientes
├── ✅ Asistencias
├── 🎫 Tipos de Membresía
├── 🔄 Renovar Membresías
├── 📈 Reportes
├── 👤 Usuarios
└── ⚙️ Configuración
```

### **Usuario ve:**
```
Sidebar:
├── 👥 Clientes
├── 🎫 Tipos de Membresía
└── 🔄 Renovar Membresías
```

**Mucho más simple y enfocado.**

---

## 🔄 **Cambiar Rol de un Usuario**

### **Como Administrador:**

1. Ir a **Usuarios**
2. Buscar el usuario
3. Clic en **Editar**
4. Cambiar "Rol":
   - `admin` → Administrador (acceso total)
   - `usuario` → Usuario (acceso limitado)
5. Guardar

**El cambio aplica inmediatamente en el siguiente inicio de sesión.**

---

## 💡 **Personalizar Permisos**

Si quieres cambiar qué puede ver cada rol, edita `src/App.jsx`:

```javascript
const permisosPorRol = {
  admin: {
    dashboard: true,
    clientes: true,
    asistencias: true,
    membresias: true,
    renovar: true,
    reportes: true,
    usuarios: true,
    configuracion: true
  },
  usuario: {
    dashboard: false,        // ← Cambiar a true si quieres que vea Dashboard
    clientes: true,
    asistencias: false,      // ← Cambiar a true si quieres que registre asistencias
    membresias: true,
    renovar: true,
    reportes: false,         // ← Cambiar a true si quieres que vea reportes
    usuarios: false,
    configuracion: false
  }
};
```

---

## 📋 **Casos de Uso Específicos**

### **Caso 1: Instructor que Cobra**
```
Rol: usuario
Permisos necesarios:
- clientes: true      (Para ver quién vino)
- renovar: true       (Para cobrar renovaciones)
- membresias: true    (Para saber precios)
```

### **Caso 2: Recepcionista Completa**
```
Rol: usuario
Permisos necesarios:
- clientes: true      (Registrar clientes)
- asistencias: true   (Registrar entradas) ← Modificar en código
- renovar: true       (Cobrar)
- membresias: true    (Consultar precios)
```

### **Caso 3: Solo Cobros**
```
Rol: usuario
Permisos necesarios:
- clientes: true      (Ver clientes)
- renovar: true       (Solo renovar)
- membresias: true    (Ver precios)
```

---

## ✅ **Beneficios del Sistema de Permisos**

1. **🔐 Seguridad** - Información sensible protegida
2. **📊 Control** - Sabes quién hizo qué
3. **👥 Delegación** - Puedes contratar personal sin preocupaciones
4. **📈 Auditoría** - Log completo de acciones
5. **🎯 Enfoque** - Cada usuario ve solo lo que necesita
6. **⚡ Simplicidad** - Interfaz más limpia para usuarios limitados
7. **💼 Profesional** - Sistema de nivel empresarial

---

## 🚀 **Implementación Técnica**

### **Código en `src/App.jsx`:**

```javascript
// Definir permisos
const permisosPorRol = {
  admin: { ... },
  usuario: { ... }
};

// Verificar permisos
const tienePermiso = (modulo) => {
  const rol = usuario.rol || 'usuario';
  return permisosPorRol[rol]?.[modulo] || false;
};

// Mostrar solo módulos permitidos
{tienePermiso('dashboard') && (
  <NavLink to="/">Dashboard</NavLink>
)}

// Proteger rutas
<Route 
  path="reportes" 
  element={tienePermiso('reportes') ? <Reportes /> : <Navigate to="/" />} 
/>
```

---

## 📝 **Resumen**

| Característica | Implementado |
|----------------|--------------|
| Sistema de roles | ✅ |
| Permisos por módulo | ✅ |
| Sidebar dinámico | ✅ |
| Rutas protegidas | ✅ |
| Indicador visual de rol | ✅ |
| Redirección automática | ✅ |
| Personalizable | ✅ |

---

## 🎉 **¡Listo para Usar!**

**Administrador ve TODO:**
- Dashboard, Clientes, Asistencias, Membresías, Renovar, Reportes, Usuarios, Configuración

**Usuario ve SOLO:**
- Clientes, Tipos de Membresía, Renovar Membresías

---

**Fecha:** 11 de Octubre, 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Implementado y Funcional

