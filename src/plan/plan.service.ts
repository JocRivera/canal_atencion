import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CrearPlanDto } from './dto/crear-plan.dto.js';
import { ActualizarPlanDto } from './dto/actualizar-plan.dto.js';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos() {
    return await this.prisma.db.orm.public.Plan.all();
  }

  async obtenerTodosEnriquecidos() {
    const planes = await this.prisma.db.orm.public.Plan.all();

    return Promise.all(
      planes.map(async (plan) => {
        const relaciones = await this.prisma.db.orm.public.PlanServicio
          .where({ planId: plan.id })
          .all();

        const servicios = await Promise.all(
          relaciones.map((relacion) =>
            this.prisma.db.orm.public.Servicio.first({
              id: relacion.servicioId,
            }),
          ),
        );

        return {
          ...plan,
          servicios: servicios.filter(Boolean),
        };
      }),
    );
  }

  async obtenerPorId(id: string) {
    const plan =
      await this.prisma.db.orm.public.Plan.first({ id });

    if (!plan) {
      throw new NotFoundException(
        `No existe el plan con el id ${id}`,
      );
    }

    return plan;
  }

  async obtenerPorNombre(nombre: string) {
    const plan =
      await this.prisma.db.orm.public.Plan.first({
        nombre,
      });

    if (!plan) {
      throw new NotFoundException(
        `No existe el plan "${nombre}"`,
      );
    }

    return plan;
  }

  async crear(data: CrearPlanDto) {
    const existente =
      await this.prisma.db.orm.public.Plan.first({
        nombre: data.nombre,
      });

    if (existente) {
      throw new ConflictException(
        `Ya existe un plan llamado "${data.nombre}".`,
      );
    }

    return await this.prisma.db.orm.public.Plan.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      soloParejas: data.soloParejas ?? false,
      incluyeAlojamiento: data.incluyeAlojamiento ?? false,
    });
  }

  async actualizar(id: string, data: ActualizarPlanDto) {
    await this.obtenerPorId(id);

    return await this.prisma.db.orm.public.Plan
      .where({ id })
      .update({
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        soloParejas: data.soloParejas,
        incluyeAlojamiento: data.incluyeAlojamiento,
      });
  }
}