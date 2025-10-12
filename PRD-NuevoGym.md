# 📋 PRD - NuevoGym Sistema de Gestión de Gimnasio

## 1. Descripción General

NuevoGym es un sistema desktop de gestión integral para gimnasios que funciona offline, desarrollado con Electron + React. Permite gestión de clientes, control de asistencias, administración de membresías, generación de tickets de pago y reportes financieros. Incluye integración con sensor de huellas dactilares y control de chapa eléctrica vía Arduino.

---

## 2. Objetivos del Sistema

### Objetivos Principales:
- Gestionar registro completo de clientes con foto y huella dactilar
- Controlar asistencias manual y automáticamente vía sensor de huellas
- Administrar tipos de membresía y renovaciones
- Generar tickets de pago con numeración automática
- Producir reportes financieros y operativos
- Funcionar 100% offline sin necesidad de internet

### Objetivos Secundarios:
- Sistema multi-usuario con roles y permisos
- Control de acceso automatizado con chapa eléctrica
- Backup y restauración de datos
- Interfaz moderna con tema claro/oscuro

---

## 3. Usuarios del Sistema

### Usuario Admin (Administrador)
- **Rol:** Dueño o gerente del gimnasio
- **Acceso:** Todos los módulos
- **Responsabilidades:** Configuración, reportes, gestión de usuarios, backup

### Usuario Operativo (Usuario)
- **Rol:** Recepcionista o personal operativo
- **Acceso:** Clientes, Tipos de Membresía, Renovar Membresías
- **Responsabilidades:** Atención a clientes, renovaciones, registro

---

## 4. Módulos del Sistema

### 4.1 Módulo de Login
**Descripción:** Autenticación de usuarios al sistema

**Funcionalidades:**
- Campo de usuario (texto)
- Campo de contraseña (password)
- Botón "Iniciar Sesión"
- Validación de credenciales contra base de datos
- Encriptación de contraseñas con bcrypt
- Mensajes de error claros

**Credenciales por defecto:**
- Usuario: admin
- Contraseña: admin123

**Criterios de Aceptación:**
- Usuario puede iniciar sesión con credenciales válidas
- Sistema muestra error con credenciales inválidas
- Contraseña debe estar hasheada en base de datos
- Sesión persiste en localStorage

---

### 4.2 Módulo Dashboard
**Descripción:** Vista general con estadísticas clave del gimnasio

**Funcionalidades:**
- Tarjeta "Ingresos Mensuales" mostrando total en Quetzales (Q)
- Tarjeta "Asistencias Diarias" con contador
- Tarjeta "Total Clientes" activos
- Tarjeta "Membresías Próximas a Vencer"
- Gráfico de asistencias de los últimos 7 días
- Gráfico de ingresos mensuales
- Botón "Actualizar" para refrescar datos

**Criterios de Aceptación:**
- Estadísticas se cargan al abrir el módulo
- Montos se muestran en formato Q1,234.56 (Quetzales)
- Gráficos son interactivos (Recharts)
- Datos se actualizan al hacer clic en "Actualizar"
- Maneja correctamente base de datos vacía (muestra 0)

---

### 4.3 Módulo Clientes
**Descripción:** Gestión completa de clientes del gimnasio

**Funcionalidades:**
- Listado de clientes con paginación (10 por página)
- Búsqueda por nombre o teléfono
- Botón "+ Nuevo Cliente"
- Modal de registro con campos:
  - Nombre completo (requerido)
  - Teléfono (requerido)
  - Foto (opcional, captura con webcam)
  - Tipo de membresía (selector)
  - Fecha de inicio (automática)
  - Fecha de vencimiento (calculada según tipo)
  - Huella dactilar (opcional, vía sensor)
- Botón "Editar" para modificar cliente
- Botón "Ver Detalle" para historial completo
- Indicador visual de estado (activo/vencido)

**Criterios de Aceptación:**
- Se puede crear cliente con solo nombre y teléfono
- Fecha de vencimiento se calcula automáticamente según tipo de membresía
- Foto se puede capturar desde webcam integrada
- Huella se puede registrar si sensor está configurado
- Búsqueda filtra en tiempo real
- Paginación funciona correctamente
- Estado "vencido" se muestra en rojo si fecha_vencimiento < hoy

---

### 4.4 Módulo Asistencias
**Descripción:** Registro y consulta de asistencias de clientes

**Funcionalidades:**
- Listado de asistencias ordenadas por fecha descendente
- Filtros por fecha (inicio y fin)
- Botón "Registrar Asistencia Manual"
- Modal con selector de cliente
- Registro automático vía sensor de huellas
- Indicador de método (manual/huella)
- Avatar con inicial del cliente
- Timestamp con fecha y hora

**Criterios de Aceptación:**
- Se puede registrar asistencia manualmente seleccionando cliente
- Sensor registra asistencia automáticamente al detectar huella
- Listado muestra fecha/hora en formato es-GT
- Filtros por fecha funcionan correctamente
- Asistencias se guardan con método de verificación

---

### 4.5 Módulo Tipos de Membresía
**Descripción:** Configuración de planes de membresía disponibles

**Funcionalidades:**
- Listado de tipos de membresía
- Botón "+ Nueva Membresía"
- Modal con campos:
  - Nombre (requerido)
  - Duración en días (requerido, número)
  - Precio (requerido, en Quetzales)
  - Descripción (opcional)
  - Estado activo/inactivo (toggle)
- Botón "Editar" para modificar
- Botón "Eliminar" (confirmación requerida)

**Tipos por defecto:**
- Mensual: 30 días, Q150.00
- Trimestral: 90 días, Q400.00
- Semestral: 180 días, Q750.00
- Anual: 365 días, Q1,300.00

**Criterios de Aceptación:**
- Se pueden crear tipos personalizados
- Precio se muestra en formato Q1,234.56
- Duración se valida como número positivo
- Solo membresías activas aparecen en selectores
- Eliminar requiere confirmación

---

### 4.6 Módulo Renovar Membresías
**Descripción:** Renovación rápida de membresías con generación de tickets

**Funcionalidades:**
- Tarjetas con estadísticas:
  - Vencen hoy
  - Vencen en 7 días
  - Vencen en 30 días
- Filtros:
  - Búsqueda por nombre
  - Filtro por estado (todos/activos/vencidos)
- Tabla de clientes con:
  - Nombre
  - Teléfono
  - Tipo de membresía
  - Fecha de vencimiento
  - Días restantes
  - Botón "Renovar"
- Modal de renovación con:
  - Datos del cliente (solo lectura)
  - Selector de nueva membresía
  - Método de pago (Efectivo/Transferencia)
  - Cálculo automático de nueva fecha
  - Botón "Renovar y Generar Ticket"
- Generación automática de ticket de renovación
- Impresión directa a impresora térmica 80mm

**Criterios de Aceptación:**
- Estadísticas se calculan correctamente
- Filtros funcionan en tiempo real
- Modal muestra datos actuales del cliente
- Nueva fecha se calcula: fecha actual + duración de membresía
- Ticket se genera con número único autoincremental
- Ticket contiene: número, cliente, membresía, fechas, monto, método, usuario
- Se puede imprimir directamente
- Renovación actualiza fecha_vencimiento en cliente
- Se registra en tabla tickets

---

### 4.7 Módulo Reportes
**Descripción:** Generación de 5 tipos de reportes con exportación

**Funcionalidades:**

#### Reporte de Clientes:
- Total de clientes
- Clientes activos vs vencidos
- Tabla completa con todos los datos
- Exportación a CSV

#### Reporte de Asistencias:
- Filtro por rango de fechas
- Total de asistencias
- Promedio diario
- Días con registro
- Tabla detallada
- Exportación a CSV

#### Reporte de Ingresos:
- Filtro por rango de fechas
- Total de ingresos
- Desglose por método de pago (Efectivo/Transferencia)
- Promedio por pago
- Tabla con cliente, monto, método, fecha
- Exportación a CSV

#### Reporte de Membresías por Vencer:
- Filtro automático (próximos 30 días)
- Categorías: vencen en 7 días, 30 días, ya vencidas
- Tabla ordenada por fecha de vencimiento
- Días restantes calculados
- Exportación a CSV

#### Reporte de Tickets Generados:
- Filtro por mes/año
- Total de tickets del período
- Total de ingresos del período
- Promedio por ticket
- Desglose por tipo de ticket (renovación/nuevo cliente/pago)
- Desglose por método de pago
- Tabla detallada con: #ticket, cliente, tipo, monto, método, fecha
- Exportación a CSV para cuadre de caja

**Criterios de Aceptación:**
- Selector de tipo de reporte funciona
- Filtros de fecha aplican correctamente
- Cálculos de totales y promedios son correctos
- Exportación CSV contiene todos los datos
- Formato de montos: Q1,234.56
- Formato de fechas: es-GT (dd/mm/yyyy)
- Impresión optimizada (oculta sidebar y botones)

---

### 4.8 Módulo Usuarios
**Descripción:** Gestión de usuarios del sistema con roles

**Funcionalidades:**
- Listado de usuarios
- Botón "+ Nuevo Usuario"
- Modal con campos:
  - Usuario (único, requerido)
  - Contraseña (requerida, mínimo 6 caracteres)
  - Nombre completo (requerido)
  - Rol (admin/usuario)
  - Estado (activo/inactivo)
- Botón "Editar"
- Botón "Desactivar" (no eliminar, solo marcar como inactivo)
- Auditoría de acciones

**Roles:**
- **admin:** Acceso total (Dashboard, Clientes, Asistencias, Membresías, Renovar, Reportes, Usuarios, Configuración)
- **usuario:** Acceso limitado (Clientes, Tipos Membresía, Renovar)

**Criterios de Aceptación:**
- Contraseñas se hashean con bcrypt antes de guardar
- Usuario debe ser único
- Solo admin puede crear usuarios
- Solo admin puede ver módulo Usuarios
- Cambio de rol aplica en siguiente inicio de sesión
- Desactivar usuario no lo elimina, solo lo marca inactivo
- Usuarios inactivos no pueden iniciar sesión

---

### 4.9 Módulo Configuración
**Descripción:** Ajustes del sistema, hardware y backup

**Funcionalidades:**

#### Sección Cambiar Contraseña:
- Campo: Nueva contraseña
- Campo: Confirmar contraseña
- Validación: mínimo 6 caracteres, coincidencia
- Botón "Cambiar Contraseña"

#### Sección Sensor de Huellas:
- Campo: IP del sensor (ej: 192.168.0.5)
- Puerto: 9000 (fijo)
- Guardado en tabla configuracion

#### Sección Chapa Eléctrica (Arduino):
- Selector: Puerto COM (lista dinámica de puertos disponibles)
- Campo: Baudios (número, default 9600)
- Campo: Tiempo de apertura en segundos (número, default 5)
- Checkbox: Habilitar chapa
- Botón "Probar Conexión"
- Botón "Abrir Chapa Manualmente"
- Código Arduino incluido (copiable)

#### Sección Respaldo de Base de Datos:
- Info: Tamaño, última modificación, estadísticas
- Botón "Crear Copia de Seguridad" (descarga .db)
- Botón "Restaurar desde Backup" (selecciona .db)
- Botón "Insertar Datos de Prueba" (8 clientes, 24 tickets)
- Warnings sobre sobrescritura

#### Sección Tema:
- Toggle entre modo claro y oscuro (integrado en sidebar)

**Criterios de Aceptación:**
- Cambio de contraseña requiere confirmación
- IP del sensor se guarda y persiste
- Lista de puertos COM se actualiza dinámicamente
- Prueba de Arduino muestra resultado
- Backup descarga archivo .db
- Restaurar crea backup automático antes de sobrescribir
- Datos de prueba se insertan correctamente

---

## 5. Funcionalidades Especiales

### 5.1 Sistema de Tickets
**Descripción:** Generación automática de tickets de pago con numeración única

**Tipos de Tickets:**
1. **Renovación:** Al renovar membresía de cliente existente
2. **Nuevo Cliente:** Al registrar cliente nuevo con pago
3. **Pago:** Pago individual registrado en detalle de cliente

**Estructura del Ticket:**
- Encabezado con logo (public/images/logo-ticket.png)
- Título "GYM CENTER"
- Separadores (====== y ------)
- Número de ticket: #000001 (autoincremental)
- Fecha y hora de generación
- Vendedor/usuario que lo generó
- Datos del cliente (nombre, teléfono)
- Detalles de membresía (tipo, fecha inicio, fecha vencimiento)
- Información de pago (método, monto)
- Total destacado
- Pie con verso bíblico: "Salmos 37:5 - Encomienda al Señor tu camino, Confía en Él, que Él actuará"
- Sistema de gestión y timestamp

**Formato:** Optimizado para impresora térmica 80mm

**Criterios de Aceptación:**
- Número de ticket es único e incremental
- Se guarda en tabla tickets con datos_json completo
- Se puede reimprimir desde historial
- Formato es compatible con impresoras térmicas
- Logo se muestra correctamente

---

### 5.2 Integración Sensor de Huellas
**Descripción:** Comunicación con api.exe para registro y verificación de huellas

**Arquitectura:**
- api.exe (C# OWIN) corre en PC del sensor
- api.exe envía datos a NuevoGym vía webhook HTTP
- NuevoGym escucha en puerto 9000
- Endpoint: POST /webhook

**Flujo de Registro:**
1. Usuario hace clic en "Registrar Huella" en formulario de cliente
2. Sistema llama a api.exe/captureWait
3. Cliente coloca dedo en sensor
4. api.exe devuelve template_b64
5. Sistema guarda template en campo huella_id del cliente

**Flujo de Verificación:**
1. Cliente coloca dedo en sensor (en cualquier momento)
2. api.exe envía datos a NuevoGym/webhook
3. Sistema compara template_b64 con todas las huellas registradas
4. Si match (score > 40):
   - Identifica cliente
   - Verifica membresía vigente
   - Registra asistencia
   - Abre chapa eléctrica (si configurada)
   - Muestra notificación con foto y nombre
5. Si no match o membresía vencida:
   - Muestra notificación "Acceso Denegado"

**Criterios de Aceptación:**
- Registro de huella espera hasta 20 segundos
- Comparación usa algoritmo de template matching
- Score mínimo para match: 40
- Asistencia se registra con método "huella"
- Notificaciones se muestran 4 segundos
- Notificación incluye sonido (success/error)
- Sistema funciona sin sensor (modo degradado)

---

### 5.3 Integración Arduino (Chapa Eléctrica)
**Descripción:** Control de cerradura eléctrica vía puerto serial

**Hardware:**
- Arduino (cualquier modelo con puerto serial)
- Relé para control de chapa
- Conexión USB a PC

**Comunicación:**
- Puerto: Configurable (ej: COM3)
- Baudios: Configurable (default 9600)
- Comando: "OPEN_DOOR"

**Flujo:**
1. Sistema detecta huella válida
2. Envía comando "OPEN_DOOR" por puerto serial
3. Arduino activa relé
4. Relé abre chapa
5. Espera tiempo configurado (default 5 segundos)
6. Relé cierra chapa

**Criterios de Aceptación:**
- Detección automática de puertos COM
- Prueba de conexión muestra resultado
- Apertura manual funciona desde Configuración
- Tiempo de apertura es configurable
- Sistema funciona sin Arduino (modo degradado)

---

## 6. Reglas de Negocio

### 6.1 Membresías
- Fecha de vencimiento = Fecha de inicio + Duración en días
- Estado activo si fecha_vencimiento >= hoy
- Estado vencido si fecha_vencimiento < hoy
- Renovación recalcula desde fecha actual (no desde vencimiento anterior)

### 6.2 Asistencias
- Solo clientes con membresía vigente pueden registrar asistencia
- Asistencia por huella requiere match con score > 40
- Se puede registrar asistencia manual independientemente de estado

### 6.3 Tickets
- Número de ticket es único y autoincremental
- No se pueden eliminar tickets (inmutables)
- Cada renovación genera ticket nuevo
- Ticket incluye usuario que lo generó para auditoría

### 6.4 Usuarios
- Usuario "admin" no se puede eliminar
- Solo admin puede crear usuarios
- Solo admin puede cambiar roles
- Contraseñas se hashean con bcrypt (10 salt rounds)

### 6.5 Permisos
- Admin: Acceso total
- Usuario: Solo Clientes, Tipos Membresía, Renovar
- Rutas protegidas redirigen si no hay permiso

---

## 7. Formato de Datos

### 7.1 Moneda
- Formato: Quetzales (Q)
- Locale: es-GT
- Ejemplo: Q1,234.56

### 7.2 Fechas
- Formato: dd/mm/yyyy
- Locale: es-GT
- Ejemplo: 11/10/2025

### 7.3 Fecha y Hora
- Formato: dd/mm/yyyy HH:mm
- Locale: es-GT
- Ejemplo: 11/10/2025 14:30

---

## 8. Base de Datos

### Tecnología: SQLite (better-sqlite3)

### Tablas:

#### clientes
- id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado, huella_id, foto, created_at, updated_at

#### membresias
- id, nombre, duracion_dias, precio, descripcion, activo

#### asistencias
- id, cliente_id, fecha_hora, tipo_entrada, metodo_verificacion, created_at

#### tickets
- id, numero_ticket (UNIQUE), tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json

#### usuarios
- id, usuario (UNIQUE), password, nombre_completo, rol, activo, created_at

#### pagos
- id, cliente_id, monto, metodo_pago, concepto, fecha_pago, created_at

#### configuracion
- id, clave (UNIQUE), valor, created_at

#### auditoria
- id, usuario_id, usuario_nombre, accion, modulo, detalles, fecha_hora

---

## 9. Requisitos Técnicos

### Frontend:
- React 18
- Vite
- React Router DOM
- Recharts (gráficos)
- Heroicons (iconos)

### Backend:
- Electron 28
- Node.js 20
- better-sqlite3 (base de datos)
- bcryptjs (encriptación)
- serialport (Arduino)
- axios (HTTP client)

### Sistema Operativo:
- Windows 7/8/10/11 (64 bits)
- macOS 10.13+

---

## 10. Casos de Prueba Prioritarios

### CP-001: Login Exitoso
- Usuario ingresa credenciales válidas
- Sistema autentica y muestra dashboard (admin) o clientes (usuario)

### CP-002: Crear Cliente
- Usuario crea cliente con nombre y teléfono
- Sistema asigna membresía y calcula fecha de vencimiento

### CP-003: Renovar Membresía
- Usuario selecciona cliente y renueva
- Sistema genera ticket y actualiza fecha

### CP-004: Registrar Asistencia Manual
- Usuario selecciona cliente y registra asistencia
- Sistema guarda con timestamp actual

### CP-005: Generar Reporte de Tickets
- Usuario selecciona mes y genera reporte
- Sistema muestra estadísticas correctas y tabla detallada

### CP-006: Sistema de Permisos
- Usuario con rol "usuario" solo ve módulos permitidos
- Usuario admin ve todos los módulos

### CP-007: Sensor de Huellas
- Cliente toca sensor
- Sistema identifica, verifica membresía y registra asistencia

### CP-008: Backup de Base de Datos
- Usuario crea backup
- Sistema descarga archivo .db

---

## 11. Criterios de Éxito

- ✅ Sistema funciona 100% offline
- ✅ Todos los módulos cargan correctamente
- ✅ Base de datos se crea automáticamente
- ✅ Credenciales por defecto funcionan
- ✅ Se pueden crear clientes y renovar membresías
- ✅ Tickets se generan correctamente
- ✅ Reportes muestran datos correctos
- ✅ Sistema de permisos funciona
- ✅ Sensor de huellas registra asistencias (si está conectado)
- ✅ Instalador Windows se ejecuta sin errores

---

## 12. Notas Adicionales

- Puerto de desarrollo: 4000
- Puerto webhook sensor: 9000
- Timeout captura huella: 20 segundos
- Retención de artifacts en GitHub: 90 días
- Paginación de clientes: 10 por página
- Duración notificación sensor: 4 segundos

---

**Versión:** 1.0.0  
**Fecha:** 11 de Octubre, 2025  
**Tipo:** Sistema Desktop (Electron)  
**Plataformas:** Windows, macOS

