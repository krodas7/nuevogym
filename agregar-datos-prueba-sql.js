// Script para generar SQL de datos de prueba
const fs = require('fs');
const path = require('path');

// Datos de prueba
const clientesPrueba = [
  { nombre: 'Juan Pérez', telefono: '12345678' },
  { nombre: 'María López', telefono: '23456789' },
  { nombre: 'Carlos García', telefono: '34567890' },
  { nombre: 'Ana Martínez', telefono: '45678901' },
  { nombre: 'Luis Rodríguez', telefono: '56789012' },
  { nombre: 'Sofia Hernández', telefono: '67890123' },
  { nombre: 'Pedro González', telefono: '78901234' },
  { nombre: 'Laura Díaz', telefono: '89012345' }
];

const tiposMembresia = ['Mensual', 'Trimestral', 'Semestral', 'Anual'];
const metodossPago = ['Efectivo', 'Transferencia'];
const tiposTicket = ['renovacion', 'nuevo_cliente', 'pago'];

const montos = {
  'Mensual': 150.00,
  'Trimestral': 400.00,
  'Semestral': 750.00,
  'Anual': 1300.00
};

let sql = `-- SQL para insertar datos de prueba en NuevoGym
-- Generado automáticamente
-- Fecha: ${new Date().toLocaleString('es-GT')}

BEGIN TRANSACTION;

-- ====================================
-- INSERTAR CLIENTES DE PRUEBA
-- ====================================

`;

let clienteId = 1;
const clientesConIds = [];

clientesPrueba.forEach((cliente, index) => {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - Math.floor(Math.random() * 60));
  
  const duracionDias = [30, 90, 180, 365][Math.floor(Math.random() * 4)];
  const fechaVencimiento = new Date(fechaInicio);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + duracionDias);

  const tipoMembresia = tiposMembresia[Math.floor(Math.random() * tiposMembresia.length)];

  clientesConIds.push({
    id: clienteId,
    ...cliente,
    tipo_membresia: tipoMembresia,
    fecha_inicio: fechaInicio.toISOString().split('T')[0],
    fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0]
  });

  sql += `INSERT OR IGNORE INTO clientes (id, nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado) 
VALUES (${clienteId}, '${cliente.nombre}', '${cliente.telefono}', '${fechaInicio.toISOString().split('T')[0]}', '${fechaVencimiento.toISOString().split('T')[0]}', '${tipoMembresia}', 'activo');\n`;
  
  clienteId++;
});

sql += `
-- ====================================
-- INSERTAR TICKETS DE PRUEBA
-- ====================================

`;

let numeroTicket = 1;
const mesesAtras = 3;
const ticketsPorMes = 8;
let totalIngresos = 0;

for (let mes = 0; mes < mesesAtras; mes++) {
  const fechaMes = new Date();
  fechaMes.setMonth(fechaMes.getMonth() - mes);
  const nombreMes = fechaMes.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });
  
  sql += `\n-- Mes: ${nombreMes}\n`;
  
  for (let i = 0; i < ticketsPorMes; i++) {
    const cliente = clientesConIds[Math.floor(Math.random() * clientesConIds.length)];
    const tipoTicket = tiposTicket[Math.floor(Math.random() * tiposTicket.length)];
    const metodoPago = metodossPago[Math.floor(Math.random() * metodossPago.length)];
    const monto = montos[cliente.tipo_membresia] || 150.00;

    const fechaTicket = new Date(fechaMes);
    fechaTicket.setDate(Math.floor(Math.random() * 28) + 1);
    fechaTicket.setHours(Math.floor(Math.random() * 12) + 8);
    fechaTicket.setMinutes(Math.floor(Math.random() * 60));

    const datosJson = {
      tipo: tipoTicket,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        telefono: cliente.telefono
      },
      membresia: {
        nombre: cliente.tipo_membresia,
        precio: monto
      },
      monto: monto,
      metodo_pago: metodoPago,
      fecha_inicio: cliente.fecha_inicio,
      fecha_vencimiento: cliente.fecha_vencimiento,
      numero_ticket: numeroTicket,
      fecha_generacion: fechaTicket.toISOString()
    };

    const datosJsonStr = JSON.stringify(datosJson).replace(/'/g, "''");

    sql += `INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json) 
VALUES (${numeroTicket}, '${tipoTicket}', ${cliente.id}, 1, ${monto}, '${metodoPago}', '${fechaTicket.toISOString()}', '${datosJsonStr}');\n`;
    
    numeroTicket++;
    totalIngresos += monto;
  }
}

sql += `
COMMIT;

-- ====================================
-- RESUMEN
-- ====================================
-- Clientes insertados: ${clientesConIds.length}
-- Tickets insertados: ${numeroTicket - 1}
-- Total ingresos: Q${totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
-- Meses con datos: ${mesesAtras}
`;

// Guardar el SQL en un archivo
const sqlPath = path.join(__dirname, 'datos-prueba.sql');
fs.writeFileSync(sqlPath, sql, 'utf8');

console.log('✅ Archivo SQL generado exitosamente!');
console.log(`📄 Ubicación: ${sqlPath}`);
console.log('');
console.log('📊 RESUMEN:');
console.log(`   👥 Clientes: ${clientesConIds.length}`);
console.log(`   🎫 Tickets: ${numeroTicket - 1}`);
console.log(`   💰 Total Ingresos: Q${totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`);
console.log(`   📅 Meses: ${mesesAtras}`);
console.log('');
console.log('🚀 Para aplicar los datos:');
console.log('   1. Copia el contenido de datos-prueba.sql');
console.log('   2. En la aplicación, ve a Configuración > Base de Datos');
console.log('   3. O usa un cliente SQLite para ejecutar el script');
console.log('');
console.log('📝 Contenido del archivo SQL guardado.');

