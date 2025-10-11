const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

// Obtener ruta de la base de datos
const dbPath = path.join(process.env.HOME, 'Library/Application Support/nuevogym/nuevogym.db');
console.log('📂 Ruta de base de datos:', dbPath);

const db = new Database(dbPath);

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

console.log('\n🚀 Iniciando inserción de datos de prueba...\n');

try {
  // Obtener el número de ticket actual
  const getNextTicketNumber = () => {
    const result = db.prepare('SELECT MAX(numero_ticket) as max_number FROM tickets').get();
    return (result.max_number || 0) + 1;
  };

  // Insertar clientes si no existen
  console.log('👥 Insertando clientes de prueba...');
  const insertCliente = db.prepare(`
    INSERT INTO clientes (nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const clientesIds = [];
  clientesPrueba.forEach((cliente, index) => {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - Math.floor(Math.random() * 60)); // Entre 0 y 60 días atrás
    
    const duracionDias = [30, 90, 180, 365][Math.floor(Math.random() * 4)];
    const fechaVencimiento = new Date(fechaInicio);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + duracionDias);

    const tipoMembresia = tiposMembresia[Math.floor(Math.random() * tiposMembresia.length)];

    try {
      const result = insertCliente.run(
        cliente.nombre,
        cliente.telefono,
        fechaInicio.toISOString().split('T')[0],
        fechaVencimiento.toISOString().split('T')[0],
        tipoMembresia,
        'activo'
      );
      clientesIds.push(result.lastInsertRowid);
      console.log(`  ✅ Cliente insertado: ${cliente.nombre} (ID: ${result.lastInsertRowid})`);
    } catch (error) {
      if (error.message.includes('UNIQUE')) {
        const existing = db.prepare('SELECT id FROM clientes WHERE telefono = ?').get(cliente.telefono);
        if (existing) {
          clientesIds.push(existing.id);
          console.log(`  ⚠️  Cliente ya existe: ${cliente.nombre} (ID: ${existing.id})`);
        }
      } else {
        console.error(`  ❌ Error al insertar ${cliente.nombre}:`, error.message);
      }
    }
  });

  console.log(`\n✅ Total clientes disponibles: ${clientesIds.length}\n`);

  // Obtener usuario admin
  const adminUser = db.prepare('SELECT id FROM usuarios WHERE usuario = ?').get('admin');
  const adminId = adminUser ? adminUser.id : 1;

  // Insertar tickets de prueba para los últimos 3 meses
  console.log('🎫 Generando tickets de prueba...\n');
  const insertTicket = db.prepare(`
    INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, fecha_generacion, datos_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const mesesAtras = 3;
  const ticketsPorMes = 8; // 8 tickets por mes
  let totalTickets = 0;
  let totalIngresos = 0;

  for (let mes = 0; mes < mesesAtras; mes++) {
    const fechaMes = new Date();
    fechaMes.setMonth(fechaMes.getMonth() - mes);
    const nombreMes = fechaMes.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });
    
    console.log(`📅 Mes: ${nombreMes}`);
    
    for (let i = 0; i < ticketsPorMes; i++) {
      const clienteId = clientesIds[Math.floor(Math.random() * clientesIds.length)];
      const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(clienteId);
      
      if (!cliente) continue;

      const tipoTicket = tiposTicket[Math.floor(Math.random() * tiposTicket.length)];
      const metodoPago = metodossPago[Math.floor(Math.random() * metodossPago.length)];
      
      // Montos según tipo de membresía
      const montos = {
        'Mensual': 150.00,
        'Trimestral': 400.00,
        'Semestral': 750.00,
        'Anual': 1300.00
      };
      const monto = montos[cliente.tipo_membresia] || 150.00;

      // Fecha aleatoria dentro del mes
      const fechaTicket = new Date(fechaMes);
      fechaTicket.setDate(Math.floor(Math.random() * 28) + 1);
      fechaTicket.setHours(Math.floor(Math.random() * 12) + 8); // Entre 8am y 8pm
      fechaTicket.setMinutes(Math.floor(Math.random() * 60));

      const numeroTicket = getNextTicketNumber();

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

      try {
        insertTicket.run(
          numeroTicket,
          tipoTicket,
          clienteId,
          adminId,
          monto,
          metodoPago,
          fechaTicket.toISOString(),
          JSON.stringify(datosJson)
        );
        
        totalTickets++;
        totalIngresos += monto;
        
        console.log(`  ✅ Ticket #${String(numeroTicket).padStart(6, '0')} - ${cliente.nombre} - ${tipoTicket} - Q${monto.toFixed(2)} - ${metodoPago}`);
      } catch (error) {
        console.error(`  ❌ Error al insertar ticket:`, error.message);
      }
    }
    console.log('');
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE DATOS INSERTADOS');
  console.log('='.repeat(60));
  console.log(`👥 Clientes: ${clientesIds.length}`);
  console.log(`🎫 Tickets generados: ${totalTickets}`);
  console.log(`💰 Total ingresos: Q${totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`);
  console.log(`📅 Meses con datos: ${mesesAtras}`);
  console.log('='.repeat(60));

  // Mostrar estadísticas por mes
  console.log('\n📈 ESTADÍSTICAS POR MES:\n');
  
  for (let mes = 0; mes < mesesAtras; mes++) {
    const fechaMes = new Date();
    fechaMes.setMonth(fechaMes.getMonth() - mes);
    const year = fechaMes.getFullYear();
    const month = fechaMes.getMonth() + 1;
    
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_tickets,
        SUM(monto) as total_ingresos,
        AVG(monto) as promedio,
        tipo_ticket,
        COUNT(*) as cantidad
      FROM tickets
      WHERE strftime('%Y', fecha_generacion) = ?
        AND strftime('%m', fecha_generacion) = ?
      GROUP BY tipo_ticket
    `).all(year.toString(), month.toString().padStart(2, '0'));

    const totalMes = db.prepare(`
      SELECT 
        COUNT(*) as total_tickets,
        SUM(monto) as total_ingresos
      FROM tickets
      WHERE strftime('%Y', fecha_generacion) = ?
        AND strftime('%m', fecha_generacion) = ?
    `).get(year.toString(), month.toString().padStart(2, '0'));

    const nombreMes = fechaMes.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });
    
    console.log(`📅 ${nombreMes}:`);
    console.log(`   Total Tickets: ${totalMes.total_tickets || 0}`);
    console.log(`   Total Ingresos: Q${(totalMes.total_ingresos || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`);
    console.log(`   Promedio: Q${((totalMes.total_ingresos || 0) / (totalMes.total_tickets || 1)).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`);
    
    if (stats.length > 0) {
      console.log(`   Por tipo:`);
      stats.forEach(s => {
        console.log(`     - ${s.tipo_ticket}: ${s.cantidad} tickets`);
      });
    }
    console.log('');
  }

  console.log('\n✅ ¡Datos de prueba insertados exitosamente!\n');
  console.log('🚀 Ahora puedes:');
  console.log('   1. Abrir NuevoGym');
  console.log('   2. Ir al módulo "Reportes"');
  console.log('   3. Seleccionar "🎫 Tickets Generados"');
  console.log('   4. Elegir un mes (último mes, hace 1 mes, o hace 2 meses)');
  console.log('   5. Hacer clic en "📊 Generar Reporte"\n');

} catch (error) {
  console.error('\n❌ Error general:', error);
} finally {
  db.close();
  console.log('📦 Conexión a base de datos cerrada.\n');
}

