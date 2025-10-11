-- SQL para insertar datos de prueba en NuevoGym
-- Generado automáticamente
-- Fecha: 11/10/2025, 14:51:51

BEGIN TRANSACTION;

-- ====================================
-- INSERTAR CLIENTES DE PRUEBA
-- ====================================

INSERT OR IGNORE INTO clientes (id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado) 
VALUES (1, 'Juan Pérez', '12345678', '2025-10-11', '2025-11-10', 'Trimestral', 'activo');
INSERT OR IGNORE INTO clientes (id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado) 
VALUES (2, 'María López', '23456789', '2025-08-26', '2026-02-22', 'Mensual', 'activo');
INSERT OR IGNORE INTO clientes (id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado) 
VALUES (3, 'Carlos García', '34567890', '2025-09-26', '2025-10-26', 'Semestral', 'activo');
INSERT OR IGNORE INTO clientes (id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado) 
VALUES (4, 'Ana Martínez', '45678901', '2025-09-05', '2025-12-04', 'Trimestral', 'activo');
INSERT OR IGNORE INTO clientes (id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado) 
VALUES (5, 'Luis Rodríguez', '56789012', '2025-09-21', '2025-12-20', 'Anual', 'activo');
INSERT OR IGNORE INTO clientes (id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado) 
VALUES (6, 'Sofia Hernández', '67890123', '2025-09-08', '2025-12-07', 'Mensual', 'activo');
INSERT OR IGNORE INTO clientes (id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado) 
VALUES (7, 'Pedro González', '78901234', '2025-08-20', '2026-02-16', 'Semestral', 'activo');
INSERT OR IGNORE INTO clientes (id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado) 
VALUES (8, 'Laura Díaz', '89012345', '2025-09-29', '2025-12-28', 'Mensual', 'activo');

-- ====================================
-- INSERTAR TICKETS DE PRUEBA
-- ====================================


-- Mes: octubre de 2025
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (1, 'nuevo_cliente', 1, 1, 400, 'Efectivo', '2025-10-11T16:00:51.805Z', '{"tipo":"nuevo_cliente","cliente":{"id":1,"nombre":"Juan Pérez","telefono":"12345678"},"membresia":{"nombre":"Trimestral","precio":400},"monto":400,"metodo_pago":"Efectivo","fecha_inicio":"2025-10-11","fecha_vencimiento":"2025-11-10","numero_ticket":1,"fecha_generacion":"2025-10-11T16:00:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (2, 'renovacion', 2, 1, 150, 'Efectivo', '2025-10-27T01:14:51.805Z', '{"tipo":"renovacion","cliente":{"id":2,"nombre":"María López","telefono":"23456789"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Efectivo","fecha_inicio":"2025-08-26","fecha_vencimiento":"2026-02-22","numero_ticket":2,"fecha_generacion":"2025-10-27T01:14:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (3, 'nuevo_cliente', 4, 1, 400, 'Efectivo', '2025-10-07T21:32:51.805Z', '{"tipo":"nuevo_cliente","cliente":{"id":4,"nombre":"Ana Martínez","telefono":"45678901"},"membresia":{"nombre":"Trimestral","precio":400},"monto":400,"metodo_pago":"Efectivo","fecha_inicio":"2025-09-05","fecha_vencimiento":"2025-12-04","numero_ticket":3,"fecha_generacion":"2025-10-07T21:32:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (4, 'renovacion', 8, 1, 150, 'Transferencia', '2025-10-16T22:50:51.805Z', '{"tipo":"renovacion","cliente":{"id":8,"nombre":"Laura Díaz","telefono":"89012345"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Transferencia","fecha_inicio":"2025-09-29","fecha_vencimiento":"2025-12-28","numero_ticket":4,"fecha_generacion":"2025-10-16T22:50:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (5, 'pago', 1, 1, 400, 'Transferencia', '2025-10-11T18:12:51.805Z', '{"tipo":"pago","cliente":{"id":1,"nombre":"Juan Pérez","telefono":"12345678"},"membresia":{"nombre":"Trimestral","precio":400},"monto":400,"metodo_pago":"Transferencia","fecha_inicio":"2025-10-11","fecha_vencimiento":"2025-11-10","numero_ticket":5,"fecha_generacion":"2025-10-11T18:12:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (6, 'renovacion', 3, 1, 750, 'Transferencia', '2025-10-04T18:55:51.805Z', '{"tipo":"renovacion","cliente":{"id":3,"nombre":"Carlos García","telefono":"34567890"},"membresia":{"nombre":"Semestral","precio":750},"monto":750,"metodo_pago":"Transferencia","fecha_inicio":"2025-09-26","fecha_vencimiento":"2025-10-26","numero_ticket":6,"fecha_generacion":"2025-10-04T18:55:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (7, 'nuevo_cliente', 1, 1, 400, 'Efectivo', '2025-10-14T21:34:51.805Z', '{"tipo":"nuevo_cliente","cliente":{"id":1,"nombre":"Juan Pérez","telefono":"12345678"},"membresia":{"nombre":"Trimestral","precio":400},"monto":400,"metodo_pago":"Efectivo","fecha_inicio":"2025-10-11","fecha_vencimiento":"2025-11-10","numero_ticket":7,"fecha_generacion":"2025-10-14T21:34:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (8, 'renovacion', 8, 1, 150, 'Transferencia', '2025-10-14T19:23:51.805Z', '{"tipo":"renovacion","cliente":{"id":8,"nombre":"Laura Díaz","telefono":"89012345"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Transferencia","fecha_inicio":"2025-09-29","fecha_vencimiento":"2025-12-28","numero_ticket":8,"fecha_generacion":"2025-10-14T19:23:51.805Z"}');

-- Mes: septiembre de 2025
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (9, 'pago', 5, 1, 1300, 'Transferencia', '2025-09-22T16:44:51.805Z', '{"tipo":"pago","cliente":{"id":5,"nombre":"Luis Rodríguez","telefono":"56789012"},"membresia":{"nombre":"Anual","precio":1300},"monto":1300,"metodo_pago":"Transferencia","fecha_inicio":"2025-09-21","fecha_vencimiento":"2025-12-20","numero_ticket":9,"fecha_generacion":"2025-09-22T16:44:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (10, 'renovacion', 1, 1, 400, 'Efectivo', '2025-09-26T22:38:51.805Z', '{"tipo":"renovacion","cliente":{"id":1,"nombre":"Juan Pérez","telefono":"12345678"},"membresia":{"nombre":"Trimestral","precio":400},"monto":400,"metodo_pago":"Efectivo","fecha_inicio":"2025-10-11","fecha_vencimiento":"2025-11-10","numero_ticket":10,"fecha_generacion":"2025-09-26T22:38:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (11, 'renovacion', 4, 1, 400, 'Transferencia', '2025-09-28T01:08:51.805Z', '{"tipo":"renovacion","cliente":{"id":4,"nombre":"Ana Martínez","telefono":"45678901"},"membresia":{"nombre":"Trimestral","precio":400},"monto":400,"metodo_pago":"Transferencia","fecha_inicio":"2025-09-05","fecha_vencimiento":"2025-12-04","numero_ticket":11,"fecha_generacion":"2025-09-28T01:08:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (12, 'pago', 5, 1, 1300, 'Transferencia', '2025-09-04T17:10:51.805Z', '{"tipo":"pago","cliente":{"id":5,"nombre":"Luis Rodríguez","telefono":"56789012"},"membresia":{"nombre":"Anual","precio":1300},"monto":1300,"metodo_pago":"Transferencia","fecha_inicio":"2025-09-21","fecha_vencimiento":"2025-12-20","numero_ticket":12,"fecha_generacion":"2025-09-04T17:10:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (13, 'pago', 6, 1, 150, 'Transferencia', '2025-09-13T00:28:51.805Z', '{"tipo":"pago","cliente":{"id":6,"nombre":"Sofia Hernández","telefono":"67890123"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Transferencia","fecha_inicio":"2025-09-08","fecha_vencimiento":"2025-12-07","numero_ticket":13,"fecha_generacion":"2025-09-13T00:28:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (14, 'nuevo_cliente', 2, 1, 150, 'Transferencia', '2025-09-27T22:17:51.805Z', '{"tipo":"nuevo_cliente","cliente":{"id":2,"nombre":"María López","telefono":"23456789"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Transferencia","fecha_inicio":"2025-08-26","fecha_vencimiento":"2026-02-22","numero_ticket":14,"fecha_generacion":"2025-09-27T22:17:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (15, 'nuevo_cliente', 6, 1, 150, 'Efectivo', '2025-09-11T15:25:51.805Z', '{"tipo":"nuevo_cliente","cliente":{"id":6,"nombre":"Sofia Hernández","telefono":"67890123"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Efectivo","fecha_inicio":"2025-09-08","fecha_vencimiento":"2025-12-07","numero_ticket":15,"fecha_generacion":"2025-09-11T15:25:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (16, 'renovacion', 7, 1, 750, 'Transferencia', '2025-09-19T23:44:51.805Z', '{"tipo":"renovacion","cliente":{"id":7,"nombre":"Pedro González","telefono":"78901234"},"membresia":{"nombre":"Semestral","precio":750},"monto":750,"metodo_pago":"Transferencia","fecha_inicio":"2025-08-20","fecha_vencimiento":"2026-02-16","numero_ticket":16,"fecha_generacion":"2025-09-19T23:44:51.805Z"}');

-- Mes: agosto de 2025
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (17, 'pago', 8, 1, 150, 'Efectivo', '2025-08-18T19:31:51.805Z', '{"tipo":"pago","cliente":{"id":8,"nombre":"Laura Díaz","telefono":"89012345"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Efectivo","fecha_inicio":"2025-09-29","fecha_vencimiento":"2025-12-28","numero_ticket":17,"fecha_generacion":"2025-08-18T19:31:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (18, 'nuevo_cliente', 6, 1, 150, 'Efectivo', '2025-08-09T15:01:51.805Z', '{"tipo":"nuevo_cliente","cliente":{"id":6,"nombre":"Sofia Hernández","telefono":"67890123"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Efectivo","fecha_inicio":"2025-09-08","fecha_vencimiento":"2025-12-07","numero_ticket":18,"fecha_generacion":"2025-08-09T15:01:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (19, 'pago', 8, 1, 150, 'Efectivo', '2025-08-02T23:27:51.805Z', '{"tipo":"pago","cliente":{"id":8,"nombre":"Laura Díaz","telefono":"89012345"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Efectivo","fecha_inicio":"2025-09-29","fecha_vencimiento":"2025-12-28","numero_ticket":19,"fecha_generacion":"2025-08-02T23:27:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (20, 'pago', 3, 1, 750, 'Efectivo', '2025-08-10T21:36:51.805Z', '{"tipo":"pago","cliente":{"id":3,"nombre":"Carlos García","telefono":"34567890"},"membresia":{"nombre":"Semestral","precio":750},"monto":750,"metodo_pago":"Efectivo","fecha_inicio":"2025-09-26","fecha_vencimiento":"2025-10-26","numero_ticket":20,"fecha_generacion":"2025-08-10T21:36:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (21, 'renovacion', 8, 1, 150, 'Efectivo', '2025-08-24T00:27:51.805Z', '{"tipo":"renovacion","cliente":{"id":8,"nombre":"Laura Díaz","telefono":"89012345"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Efectivo","fecha_inicio":"2025-09-29","fecha_vencimiento":"2025-12-28","numero_ticket":21,"fecha_generacion":"2025-08-24T00:27:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (22, 'pago', 1, 1, 400, 'Efectivo', '2025-08-11T16:38:51.805Z', '{"tipo":"pago","cliente":{"id":1,"nombre":"Juan Pérez","telefono":"12345678"},"membresia":{"nombre":"Trimestral","precio":400},"monto":400,"metodo_pago":"Efectivo","fecha_inicio":"2025-10-11","fecha_vencimiento":"2025-11-10","numero_ticket":22,"fecha_generacion":"2025-08-11T16:38:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (23, 'nuevo_cliente', 4, 1, 400, 'Efectivo', '2025-08-15T17:20:51.805Z', '{"tipo":"nuevo_cliente","cliente":{"id":4,"nombre":"Ana Martínez","telefono":"45678901"},"membresia":{"nombre":"Trimestral","precio":400},"monto":400,"metodo_pago":"Efectivo","fecha_inicio":"2025-09-05","fecha_vencimiento":"2025-12-04","numero_ticket":23,"fecha_generacion":"2025-08-15T17:20:51.805Z"}');
INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (24, 'nuevo_cliente', 2, 1, 150, 'Efectivo', '2025-08-24T15:00:51.805Z', '{"tipo":"nuevo_cliente","cliente":{"id":2,"nombre":"María López","telefono":"23456789"},"membresia":{"nombre":"Mensual","precio":150},"monto":150,"metodo_pago":"Efectivo","fecha_inicio":"2025-08-26","fecha_vencimiento":"2026-02-22","numero_ticket":24,"fecha_generacion":"2025-08-24T15:00:51.805Z"}');

COMMIT;

-- ====================================
-- RESUMEN
-- ====================================
-- Clientes insertados: 8
-- Tickets insertados: 24
-- Total ingresos: Q9,700.00
-- Meses con datos: 3
