import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReservaServicioService {
    constructor(private readonly prisma: PrismaService) { }

    async obtenerServiciosDeReserva(reservaId: string) {
        return this.prisma.db.orm.public.ReservaServicio
            .where({ reservaId })
            .all();
    }

    async agregarServicioAReserva(
        reservaId: string,
        servicioId: string,
        cantidad: number,
    ) {
        const servicio = await this.prisma.db.orm.public.Servicio.first({
            id: servicioId,
        });

        if (!servicio) {
            throw new NotFoundException(
                `No existe el servicio con el id ${servicioId}`,
            );
        }

        return this.prisma.db.orm.public.ReservaServicio.create({
            reservaId,
            servicioId,
            cantidad,
            precio: servicio.precio,
        });
    }

    async actualizarCantidadDeServicioEnReserva(
        reservaId: string,
        servicioId: string,
        cantidad: number,
    ) {
        const reservaServicio =
            await this.prisma.db.orm.public.ReservaServicio.first({
                reservaId,
                servicioId,
            });

        if (!reservaServicio) {
            throw new NotFoundException(
                `No existe el servicio con el id ${servicioId} en la reserva con el id ${reservaId}`,
            );
        }

        return this.prisma.db.orm.public.ReservaServicio
            .where({
                reservaId,
                servicioId,
            })
            .update({
                cantidad,
            });
    }
}
