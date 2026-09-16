import { ReservaService } from './reserva.service.js';
import { Temporal } from 'temporal-polyfill';

describe('ReservaService', () => {
  let service: ReservaService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      db: {
        orm: {
          public: {
            Persona: { first: vi.fn() },
            Plan: { first: vi.fn() },
            Alojamiento: {
              all: vi.fn(),
              first: vi.fn(),
            },
            Reserva: {
              all: vi.fn(),
              first: vi.fn(),
              create: vi.fn(),
              where: vi.fn(),
            },
          },
        },
      },
    };

    service = new ReservaService(prisma);
  });

  it('crea una reserva sin alojamiento', async () => {
    const plan = { id: 'plan-1', precio: 100000 };
    const reservaCreada = { id: 'reserva-1' };

    prisma.db.orm.public.Persona.first.mockResolvedValue({
      id: 'persona-1',
    });
    prisma.db.orm.public.Plan.first.mockResolvedValue(plan);
    prisma.db.orm.public.Reserva.create.mockResolvedValue(
      reservaCreada,
    );

    const resultado = await service.crear({
      titularId: 'persona-1',
      planId: 'plan-1',
      fechaIngreso: '2027-01-10T00:00:00Z',
      fechaSalida: '2027-01-10T23:59:59Z',
    });

    expect(resultado).toBe(reservaCreada);
    expect(prisma.db.orm.public.Reserva.create).toHaveBeenCalledWith(
      expect.objectContaining({
        alojamientoId: undefined,
        precioPlan: 100000,
        total: 100000,
      }),
    );
  });

  it('devuelve alojamientos operativos, con capacidad y sin solapamientos', async () => {
    const alojamientoDisponible = {
      id: 'alojamiento-1',
      nombre: 'Habitación 01',
      tipo: 'HABITACION',
      capacidad: 3,
      descripcion: null,
      estado: 'OPERATIVO',
    };
    const alojamientoOcupado = {
      ...alojamientoDisponible,
      id: 'alojamiento-2',
      nombre: 'Habitación 02',
    };
    const alojamientoPequeno = {
      ...alojamientoDisponible,
      id: 'alojamiento-3',
      nombre: 'Habitación 03',
      capacidad: 2,
    };

    prisma.db.orm.public.Alojamiento.all.mockResolvedValue([
      alojamientoDisponible,
      alojamientoOcupado,
      alojamientoPequeno,
    ]);
    prisma.db.orm.public.Reserva.all.mockResolvedValue([
      {
        id: 'reserva-1',
        alojamientoId: 'alojamiento-2',
        estado: 'CONFIRMADA',
        fechaIngreso: Temporal.Instant.from('2027-01-10T00:00:00Z'),
        fechaSalida: Temporal.Instant.from('2027-01-12T00:00:00Z'),
      },
    ]);

    const resultado = await service.obtenerAlojamientosDisponibles(
      '2027-01-11T00:00:00Z',
      '2027-01-13T00:00:00Z',
      3,
    );

    expect(resultado.map(({ id }) => id)).toEqual(['alojamiento-1']);
  });

  it('rechaza actualizar hacia un alojamiento ocupado', async () => {
    const fechaIngreso = Temporal.Instant.from('2027-01-10T00:00:00Z');
    const fechaSalida = Temporal.Instant.from('2027-01-12T00:00:00Z');

    prisma.db.orm.public.Reserva.first.mockResolvedValue({
      id: 'reserva-actual',
      alojamientoId: 'alojamiento-1',
      fechaIngreso,
      fechaSalida,
    });
    prisma.db.orm.public.Alojamiento.all.mockResolvedValue([
      {
        id: 'alojamiento-2',
        nombre: 'Habitación 02',
        tipo: 'HABITACION',
        capacidad: 3,
        descripcion: null,
        estado: 'OPERATIVO',
      },
    ]);
    prisma.db.orm.public.Reserva.all.mockResolvedValue([
      {
        id: 'otra-reserva',
        alojamientoId: 'alojamiento-2',
        estado: 'CONFIRMADA',
        fechaIngreso,
        fechaSalida,
      },
    ]);

    await expect(
      service.actualizar('reserva-actual', {
        alojamientoId: 'alojamiento-2',
      }),
    ).rejects.toThrow(
      'El alojamiento seleccionado no está disponible para esas fechas.',
    );
    expect(prisma.db.orm.public.Reserva.where).not.toHaveBeenCalled();
  });

  it('permite actualizar la reserva excluyéndola del solapamiento', async () => {
    const fechaIngreso = Temporal.Instant.from('2027-01-10T00:00:00Z');
    const fechaSalida = Temporal.Instant.from('2027-01-12T00:00:00Z');

    prisma.db.orm.public.Reserva.first.mockResolvedValue({
      id: 'reserva-actual',
      alojamientoId: 'alojamiento-1',
      fechaIngreso,
      fechaSalida,
    });
    prisma.db.orm.public.Alojamiento.all.mockResolvedValue([
      {
        id: 'alojamiento-1',
        nombre: 'Habitación 01',
        tipo: 'HABITACION',
        capacidad: 3,
        descripcion: null,
        estado: 'OPERATIVO',
      },
    ]);
    prisma.db.orm.public.Reserva.all.mockResolvedValue([
      {
        id: 'reserva-actual',
        alojamientoId: 'alojamiento-1',
        estado: 'CONFIRMADA',
        fechaIngreso,
        fechaSalida,
      },
    ]);
    prisma.db.orm.public.Reserva.where.mockReturnValue({
      update: vi.fn().mockResolvedValue({ id: 'reserva-actual' }),
    });

    await service.actualizar('reserva-actual', {
      fechaSalida: '2027-01-13T00:00:00Z',
    });

    expect(prisma.db.orm.public.Reserva.where).toHaveBeenCalledWith({
      id: 'reserva-actual',
    });
  });

  it('rechaza un intervalo de fechas inválido al consultar disponibilidad', async () => {
    await expect(
      service.obtenerAlojamientosDisponibles(
        '2027-01-12T00:00:00Z',
        '2027-01-10T00:00:00Z',
      ),
    ).rejects.toThrow(
      'La fecha de salida debe ser posterior a la fecha de ingreso.',
    );
  });
});
