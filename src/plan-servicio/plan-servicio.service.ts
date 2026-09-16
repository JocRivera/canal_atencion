import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { AgregarServicioPlanDto } from './dto/agregar-servicio-plan.dto.js';

@Injectable()
export class PlanServicioService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerServiciosDelPlan(planId: string) {
    const plan =
      await this.prisma.db.orm.public.Plan.first({
        id: planId,
      });

    if (!plan) {
      throw new NotFoundException(
        `No existe el plan con el id ${planId}.`,
      );
    }

    return await this.prisma.db.orm.public.PlanServicio.where({
      planId,
    }).all();
  }

  async agregarServicio(
    planId: string,
    data: AgregarServicioPlanDto,
  ) {
    const plan =
      await this.prisma.db.orm.public.Plan.first({
        id: planId,
      });

    if (!plan) {
      throw new NotFoundException(
        `No existe el plan con el id ${planId}.`,
      );
    }

    const servicio =
      await this.prisma.db.orm.public.Servicio.first({
        id: data.servicioId,
      });

    if (!servicio) {
      throw new NotFoundException(
        `No existe el servicio con el id ${data.servicioId}.`,
      );
    }

    const existente =
      await this.prisma.db.orm.public.PlanServicio.first({
        planId,
        servicioId: data.servicioId,
      });

    if (existente) {
      throw new ConflictException(
        'El servicio ya está asociado a este plan.',
      );
    }

    return await this.prisma.db.orm.public.PlanServicio.create({
      planId,
      servicioId: data.servicioId,
    });
  }

  async quitarServicio(
    planId: string,
    servicioId: string,
  ) {
    const relacion =
      await this.prisma.db.orm.public.PlanServicio.first({
        planId,
        servicioId,
      });

    if (!relacion) {
      throw new NotFoundException(
        'El servicio no está asociado a este plan.',
      );
    }
    return await this.prisma.db.orm.public.PlanServicio.where({
      planId,
      servicioId,
    }).delete();
  }
}