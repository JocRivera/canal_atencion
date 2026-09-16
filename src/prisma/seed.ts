import { Temporal } from 'temporal-polyfill';

import { db } from './db.js';

async function ensureServicio(data: {
  nombre: string;
  descripcion: string;
  precio: number;
  soloRomantico?: boolean;
}) {
  const existente = await db.orm.public.Servicio.first({
    nombre: data.nombre,
  });

  return existente ?? db.orm.public.Servicio.create({
    nombre: data.nombre,
    descripcion: data.descripcion,
    precio: data.precio,
    soloRomantico: data.soloRomantico ?? false,
  });
}

async function ensurePlan(data: {
  nombre: string;
  descripcion: string;
  precio: number;
  soloParejas?: boolean;
  incluyeAlojamiento?: boolean;
}) {
  const existente = await db.orm.public.Plan.first({
    nombre: data.nombre,
  });

  return existente ?? db.orm.public.Plan.create({
    nombre: data.nombre,
    descripcion: data.descripcion,
    precio: data.precio,
    soloParejas: data.soloParejas ?? false,
    incluyeAlojamiento: data.incluyeAlojamiento ?? false,
  });
}

async function ensureAlojamiento(data: {
  nombre: string;
  tipo: 'HABITACION' | 'CABANA';
  capacidad: number;
  descripcion: string;
}) {
  const existente = await db.orm.public.Alojamiento.first({
    nombre: data.nombre,
  });

  return existente ?? db.orm.public.Alojamiento.create({
    nombre: data.nombre,
    tipo: data.tipo,
    capacidad: data.capacidad,
    descripcion: data.descripcion,
    estado: 'OPERATIVO',
  });
}

async function ensurePlanServicio(planId: string, servicioId: string) {
  const existente = await db.orm.public.PlanServicio.first({
    planId,
    servicioId,
  });

  return existente ?? db.orm.public.PlanServicio.create({
    planId,
    servicioId,
  });
}

async function main() {
  const servicios = {
    desayuno: await ensureServicio({
      nombre: 'Desayuno',
      descripcion: 'Desayuno incluido para los huéspedes.',
      precio: 25000,
    }),
    almuerzo: await ensureServicio({
      nombre: 'Almuerzo',
      descripcion: 'Almuerzo del día.',
      precio: 35000,
    }),
    cena: await ensureServicio({
      nombre: 'Cena',
      descripcion: 'Cena del día.',
      precio: 45000,
    }),
    coctelBienvenida: await ensureServicio({
      nombre: 'Cóctel de bienvenida',
      descripcion: 'Cóctel de bienvenida para los huéspedes.',
      precio: 30000,
      soloRomantico: true,
    }),
    cenaRomantica: await ensureServicio({
      nombre: 'Cena romántica',
      descripcion: 'Cena especial para parejas.',
      precio: 90000,
      soloRomantico: true,
    }),
    spa: await ensureServicio({
      nombre: 'Spa',
      descripcion: 'Sesión de spa.',
      precio: 80000,
    }),
  };

  const planes = {
    diaDeSol: await ensurePlan({
      nombre: 'Día de sol',
      descripcion: 'Plan de día sin alojamiento.',
      precio: 60000,
    }),
    alojamiento: await ensurePlan({
      nombre: 'Plan alojamiento',
      descripcion: 'Plan de alojamiento con alimentación completa.',
      precio: 280000,
      incluyeAlojamiento: true,
    }),
    romantico: await ensurePlan({
      nombre: 'Plan romántico',
      descripcion: 'Plan para parejas con experiencias especiales.',
      precio: 420000,
      soloParejas: true,
      incluyeAlojamiento: true,
    }),
  };

  const relaciones = [
    [planes.diaDeSol, servicios.almuerzo],
    [planes.alojamiento, servicios.desayuno],
    [planes.alojamiento, servicios.almuerzo],
    [planes.alojamiento, servicios.cena],
    [planes.romantico, servicios.desayuno],
    [planes.romantico, servicios.almuerzo],
    [planes.romantico, servicios.coctelBienvenida],
    [planes.romantico, servicios.cenaRomantica],
  ] as const;

  for (const [plan, servicio] of relaciones) {
    await ensurePlanServicio(plan.id, servicio.id);
  }

  const habitaciones = [];
  for (let numero = 1; numero <= 12; numero += 1) {
    habitaciones.push(
      await ensureAlojamiento({
        nombre: `Habitación ${String(numero).padStart(2, '0')}`,
        tipo: 'HABITACION',
        capacidad: 3,
        descripcion: 'Habitación para hasta tres personas.',
      }),
    );
  }

  const cabanas = [];
  for (let numero = 1; numero <= 10; numero += 1) {
    cabanas.push(
      await ensureAlojamiento({
        nombre: `Cabaña ${String(numero).padStart(2, '0')}`,
        tipo: 'CABANA',
        capacidad: 8,
        descripcion: 'Cabaña para hasta ocho personas.',
      }),
    );
  }

  const titular =
    (await db.orm.public.Persona.first({
      documento: '1000000001',
    })) ??
    (await db.orm.public.Persona.create({
      tipoDocumento: 'CC',
      documento: '1000000001',
      nombre: 'Cliente Demo',
      contacto: '3000000001',
      email: 'cliente.demo@example.com',
    }));

  const acompanante =
    (await db.orm.public.Persona.first({
      documento: '1000000002',
    })) ??
    (await db.orm.public.Persona.create({
      tipoDocumento: 'CC',
      documento: '1000000002',
      nombre: 'Acompañante Demo',
      contacto: '3000000002',
      email: 'acompanante.demo@example.com',
    }));

  const fechaIngreso = Temporal.Instant.from('2027-01-10T00:00:00Z');
  const fechaSalida = Temporal.Instant.from('2027-01-12T00:00:00Z');
  const reservaExistente = (
    await db.orm.public.Reserva.where({ titularId: titular.id }).all()
  ).find((reserva) => reserva.observaciones === 'SEED_RESERVA_ALOJAMIENTO');

  const reserva =
    reservaExistente ??
    (await db.orm.public.Reserva.create({
      titularId: titular.id,
      planId: planes.alojamiento.id,
      precioPlan: planes.alojamiento.precio,
      alojamientoId: habitaciones[0].id,
      cantidadHuespedes: 2,
      fechaIngreso,
      fechaSalida,
      estado: 'CONFIRMADA',
      total: planes.alojamiento.precio,
      observaciones: 'SEED_RESERVA_ALOJAMIENTO',
    }));

  const relacionAcompanante = await db.orm.public.Acompanante.first({
    reservaId: reserva.id,
    personaId: acompanante.id,
  });

  if (!relacionAcompanante) {
    await db.orm.public.Acompanante.create({
      reservaId: reserva.id,
      personaId: acompanante.id,
      tipoHuesped: 'ADULTO',
    });
  }

  for (const servicio of [
    servicios.desayuno,
    servicios.almuerzo,
    servicios.cena,
  ]) {
    const existente = await db.orm.public.ReservaServicio.first({
      reservaId: reserva.id,
      servicioId: servicio.id,
    });

    if (!existente) {
      await db.orm.public.ReservaServicio.create({
        reservaId: reserva.id,
        servicioId: servicio.id,
        cantidad: 1,
        precio: servicio.precio,
      });
    }
  }

  const programacionExistente = await db.orm.public.ProgramacionPlan.first({
    planId: planes.alojamiento.id,
  });

  if (!programacionExistente) {
    await db.orm.public.ProgramacionPlan.create({
      planId: planes.alojamiento.id,
      fechaInicio: Temporal.Instant.from('2027-01-01T00:00:00Z'),
      fechaFin: Temporal.Instant.from('2027-12-31T00:00:00Z'),
      activo: true,
      observaciones: 'SEED_PROGRAMACION_ALOJAMIENTO',
    });
  }

  console.log(
    `Seed completado: ${habitaciones.length} habitaciones, ${cabanas.length} cabañas, ${Object.keys(servicios).length} servicios y ${Object.keys(planes).length} planes.`,
  );
}

main().catch((error: unknown) => {
  console.error('Error ejecutando el seed:', error);
  process.exitCode = 1;
});
