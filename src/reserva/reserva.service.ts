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

    if (data.alojamientoId) {
      const alojamiento =
        await this.prisma.db.orm.public.Alojamiento.first({
          id: data.alojamientoId,
        });

      if (!alojamiento) {
        throw new NotFoundException(
          `No existe el alojamiento con el id ${data.alojamientoId}`,
        );
      }
    }

    const fechaIngreso = Temporal.Instant.from(data.fechaIngreso);
    const fechaSalida = Temporal.Instant.from(data.fechaSalida);

    if (Temporal.Instant.compare(fechaSalida, fechaIngreso) <= 0) {
      throw new ConflictException(
        'La fecha de salida debe ser posterior a la fecha de ingreso.',
      );
    }

    return this.prisma.db.orm.public.Reserva.create({
      titularId: data.titularId,
      planId: data.planId,
      precioPlan: plan.precio,
      alojamientoId: data.alojamientoId,
      fechaIngreso,
      fechaSalida,
      estado: data.estado ?? 'PENDIENTE_PAGO',
      total: data.total ?? plan.precio,
      observaciones: data.observaciones,
    });
  }

  async actualizar(id: string, data: ActualizarReservaDto) {
    await this.obtenerPorId(id);

    let fechaIngreso: Temporal.Instant | undefined;
    let fechaSalida: Temporal.Instant | undefined;

    if (data.fechaIngreso) {
      fechaIngreso = Temporal.Instant.from(data.fechaIngreso);
    }

    if (data.fechaSalida) {
      fechaSalida = Temporal.Instant.from(data.fechaSalida);
    }

    if (fechaIngreso && fechaSalida) {
      if (Temporal.Instant.compare(fechaSalida, fechaIngreso) <= 0) {
        throw new ConflictException(
          'La fecha de salida debe ser posterior a la fecha de ingreso.',
        );
      }
    }

    return this.prisma.db.orm.public.Reserva
      .where({ id })
      .update({
        alojamientoId: data.alojamientoId,
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
}