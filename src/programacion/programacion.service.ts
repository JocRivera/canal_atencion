import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CrearProgramacionPlanDto } from './dto/crear-programacion-plan.dto.js';
import { ActualizarProgramacionPlanDto } from './dto/actualizar-programacion-plan.dto.js';
import { Temporal } from 'temporal-polyfill';

@Injectable()
export class ProgramacionService {
  constructor(private readonly prisma: PrismaService) {}

    async obtenerTodas() {
        return await this.prisma.db.orm.public.ProgramacionPlan.all();
    }

    async obtenerPorId(id: string) {
        const programacion =
            await this.prisma.db.orm.public.ProgramacionPlan.first({
                id,
            });

        if (!programacion) {
            throw new NotFoundException(
                `No existe la programación con el id ${id}`,
            );
        }

        return programacion;
    }

    async obtenerPorPlan(planId: string) {
        const plan = await this.prisma.db.orm.public.Plan.first({
            id: planId,
        });

        if (!plan) {
            throw new NotFoundException(
                `No existe el plan con el id ${planId}`,
            );
        }

        return await this.prisma.db.orm.public.ProgramacionPlan
            .where({ planId })
            .all();
    }

    async crear(data: CrearProgramacionPlanDto) {
        const plan =
            await this.prisma.db.orm.public.Plan.first({
                id: data.planId,
            });

        if (!plan) {
            throw new NotFoundException(
                `No existe el plan con el id ${data.planId}`,
            );
        }

        const fechaInicio = Temporal.Instant.from(
            `${data.fechaInicio}T00:00:00Z`,
        );

        const fechaFin = Temporal.Instant.from(
            `${data.fechaFin}T00:00:00Z`,
        );

        if (Temporal.Instant.compare(fechaFin, fechaInicio) < 0) {
            throw new ConflictException(
                'La fecha de fin no puede ser anterior a la fecha de inicio.',
            );
        }

        await this.validarNoSolapamiento(
            data.planId,
            fechaInicio,
            fechaFin,
        );

        return await this.prisma.db.orm.public.ProgramacionPlan.create({
            planId: data.planId,
            fechaInicio,
            fechaFin,
            observaciones: data.observaciones,
            activo: true,
        });
    }

    async actualizar(
        id: string,
        data: ActualizarProgramacionPlanDto,
    ) {
        const actual = await this.obtenerPorId(id);

        const fechaInicio = data.fechaInicio
            ? Temporal.Instant.from(
                `${data.fechaInicio}T00:00:00Z`,
            )
            : actual.fechaInicio;

        const fechaFin = data.fechaFin
            ? Temporal.Instant.from(
                `${data.fechaFin}T00:00:00Z`,
            )
            : actual.fechaFin;

        if (Temporal.Instant.compare(fechaFin, fechaInicio) < 0) {
            throw new ConflictException(
                'La fecha de fin no puede ser anterior a la fecha de inicio.',
            );
        }

        await this.validarNoSolapamiento(
            actual.planId,
            fechaInicio,
            fechaFin,
            id,
        );

        return await this.prisma.db.orm.public.ProgramacionPlan
            .where({ id })
            .update({
                fechaInicio,
                fechaFin,
                activo: data.activo,
                observaciones: data.observaciones,
            });
    }

    async activar(id: string) {
        await this.obtenerPorId(id);

        return await this.prisma.db.orm.public.ProgramacionPlan
            .where({ id })
            .update({
                activo: true,
            });
    }

    async desactivar(id: string) {
        await this.obtenerPorId(id);

        return await this.prisma.db.orm.public.ProgramacionPlan
            .where({ id })
            .update({
                activo: false,
            });
    }

    private async validarNoSolapamiento(
        planId: string,
        fechaInicio: Temporal.Instant,
        fechaFin: Temporal.Instant,
        excluirId?: string,
    ) {
        const programaciones = await this.prisma.db.orm.public.ProgramacionPlan
            .where({ planId })
            .all();

        const solapada = programaciones.find((programacion) => {
            if (excluirId && programacion.id === excluirId) {
                return false;
            }

            return (
                Temporal.Instant.compare(
                    fechaInicio,
                    programacion.fechaFin,
                ) < 0 &&
                Temporal.Instant.compare(
                    fechaFin,
                    programacion.fechaInicio,
                ) > 0
            );
        });

        if (solapada) {
            throw new ConflictException(
                'El período de programación se solapa con otra programación existente para este plan.',
            );
        }
    }
}