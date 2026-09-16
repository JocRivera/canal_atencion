import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Temporal } from 'temporal-polyfill';

import { PrismaService } from '../prisma/prisma.service.js';
import { CrearReservaDto } from './dto/crear-reserva.dto.js';
import { ActualizarReservaDto } from './dto/actualizar-reserva.dto.js';

@Injectable()
export class ReservaService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodas() {
    return this.prisma.db.orm.public.Reserva.all();
  }

  async obtenerPorId(id: string) {
    const reserva = await this.prisma.db.orm.public.Reserva.first({ id });

    if (!reserva) {
      throw new NotFoundException(
        `No existe la reserva con el id ${id}`,
      );
    }

    return reserva;
  }

  async obtenerPorTitular(titularId: string) {
    return this.prisma.db.orm.public.Reserva
      .where({ titularId })
      .all();
  }

  async crear(data: CrearReservaDto) {
    const titular = await this.prisma.db.orm.public.Persona.first({
      id: data.titularId,
    });

    if (!titular) {
      throw new NotFoundException(
        `No existe la persona con el id ${data.titularId}`,
      );
    }

    const plan = await this.prisma.db.orm.public.Plan.first({
      id: data.planId,
    });

    if (!plan) {
      throw new NotFoundException(
        `No existe el plan con el id ${data.planId}`,
      );
    }

    if (plan.incluyeAlojamiento && !data.alojamientoId) {
      throw new ConflictException(
        'Este plan requiere seleccionar un alojamiento.',
      );
    }

    const fechaIngreso = Temporal.Instant.from(data.fechaIngreso);
    const fechaSalida = Temporal.Instant.from(data.fechaSalida);

    if (Temporal.Instant.compare(fechaSalida, fechaIngreso) <= 0) {
      throw new ConflictException(
        'La fecha de salida debe ser posterior a la fecha de ingreso.',
      );
    }

    if (data.alojamientoId) {
      const alojamientosDisponibles =
        await this.obtenerAlojamientosDisponibles(
          data.fechaIngreso,
          data.fechaSalida,
          data.cantidadHuespedes,
        );

      const alojamientoDisponible = alojamientosDisponibles.some(
        (alojamiento) => alojamiento.id === data.alojamientoId,
      );

      if (!alojamientoDisponible) {
        throw new ConflictException(
          'El alojamiento seleccionado no está disponible para esas fechas.',
        );
      }
    }

    return this.prisma.db.orm.public.Reserva.create({
      titularId: data.titularId,
      planId: data.planId,
      precioPlan: plan.precio,
      alojamientoId: data.alojamientoId,
      cantidadHuespedes: data.cantidadHuespedes,
      fechaIngreso,
      fechaSalida,
      estado: data.estado ?? 'PENDIENTE_PAGO',
      total: data.total ?? plan.precio,
      observaciones: data.observaciones,
    });
  }

  async actualizar(id: string, data: ActualizarReservaDto) {
    const actual = await this.obtenerPorId(id);

    const fechaIngreso = data.fechaIngreso
      ? Temporal.Instant.from(data.fechaIngreso)
      : actual.fechaIngreso;
    const fechaSalida = data.fechaSalida
      ? Temporal.Instant.from(data.fechaSalida)
      : actual.fechaSalida;

    if (Temporal.Instant.compare(fechaSalida, fechaIngreso) <= 0) {
      throw new ConflictException(
        'La fecha de salida debe ser posterior a la fecha de ingreso.',
      );
    }

    const alojamientoId =
      data.alojamientoId ?? actual.alojamientoId ?? undefined;
    const cantidadHuespedes =
      data.cantidadHuespedes ?? actual.cantidadHuespedes;

    const plan = await this.prisma.db.orm.public.Plan.first({
      id: actual.planId,
    });

    if (plan?.incluyeAlojamiento && !alojamientoId) {
      throw new ConflictException(
        'Este plan requiere seleccionar un alojamiento.',
      );
    }

    if (alojamientoId) {
      const alojamientosDisponibles =
        await this.obtenerAlojamientosDisponibles(
          fechaIngreso,
          fechaSalida,
          cantidadHuespedes,
          id,
        );

      if (
        !alojamientosDisponibles.some(
          (alojamiento) => alojamiento.id === alojamientoId,
        )
      ) {
        throw new ConflictException(
          'El alojamiento seleccionado no está disponible para esas fechas.',
        );
      }
    }

    return this.prisma.db.orm.public.Reserva
      .where({ id })
      .update({
        alojamientoId: data.alojamientoId,
        cantidadHuespedes: data.cantidadHuespedes,
        fechaIngreso,
        fechaSalida,
        estado: data.estado,
        total: data.total,
        observaciones: data.observaciones,
      });
  }

  async cancelar(id: string) {
    await this.obtenerPorId(id);

    return this.prisma.db.orm.public.Reserva
      .where({ id })
      .update({
        estado: 'CANCELADA',
      });
  }

  async obtenerAlojamientosDisponibles(
    fechaIngresoTexto: string | Temporal.Instant,
    fechaSalidaTexto: string | Temporal.Instant,
    cantidadHuespedes?: number,
    reservaIdExcluir?: string,
  ) {
    const fechaIngreso =
      typeof fechaIngresoTexto === 'string'
        ? Temporal.Instant.from(fechaIngresoTexto)
        : fechaIngresoTexto;
    const fechaSalida =
      typeof fechaSalidaTexto === 'string'
        ? Temporal.Instant.from(fechaSalidaTexto)
        : fechaSalidaTexto;

    if (Temporal.Instant.compare(fechaSalida, fechaIngreso) <= 0) {
      throw new ConflictException(
        'La fecha de salida debe ser posterior a la fecha de ingreso.',
      );
    }

    const alojamientos =
      await this.prisma.db.orm.public.Alojamiento.all();

    const reservas = await this.prisma.db.orm.public.Reserva.all();

    const reservasActivas = reservas.filter(
      (reserva) =>
        reserva.estado !== 'CANCELADA' &&
        reserva.alojamientoId,
    );

    return alojamientos
      .filter((alojamiento) => {
        if (alojamiento.estado !== 'OPERATIVO') {
          return false;
        }

        if (
          cantidadHuespedes &&
          alojamiento.capacidad < cantidadHuespedes
        ) {
          return false;
        }

        const ocupado = reservasActivas.some((reserva) => {
          if (reservaIdExcluir && reserva.id === reservaIdExcluir) {
            return false;
          }

          if (reserva.alojamientoId !== alojamiento.id) {
            return false;
          }

          return (
            Temporal.Instant.compare(
              fechaIngreso,
              reserva.fechaSalida,
            ) < 0 &&
            Temporal.Instant.compare(
              fechaSalida,
              reserva.fechaIngreso,
            ) > 0
          );
        });

        return !ocupado;
      })
      .map((alojamiento) => ({
        id: alojamiento.id,
        nombre: alojamiento.nombre,
        tipo: alojamiento.tipo,
        capacidad: alojamiento.capacidad,
        descripcion: alojamiento.descripcion,
      }))
      .sort((primero, segundo) => {
        const diferenciaCapacidad =
          primero.capacidad - segundo.capacidad;

        if (diferenciaCapacidad !== 0) {
          return diferenciaCapacidad;
        }

        if (primero.tipo === segundo.tipo) {
          return primero.nombre.localeCompare(segundo.nombre);
        }

        return primero.tipo === 'HABITACION' ? -1 : 1;
      });
  }

}