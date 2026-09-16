import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CrearAcompananteDto } from './dto/crear-acompanante.dto.js';
import { Temporal } from 'temporal-polyfill';

@Injectable()
export class AcompanantesService {
    constructor(private readonly prisma: PrismaService) { }

    async obtenerTodos() {
        return await this.prisma.db.orm.public.Acompanante.all();
    }

    async obtenerPorId(id: string) {
        const acompanante =
            await this.prisma.db.orm.public.Acompanante.first({ id });

        if (!acompanante) {
            throw new NotFoundException(
                `No existe el acompañante con el id ${id}`,
            );
        }

        return acompanante;
    }

    async obtenerPorReserva(reservaId: string) {
        return await this.prisma.db.orm.public.Acompanante
            .where({ reservaId })
            .all();
    }

    async crear(data: CrearAcompananteDto) {
        // Verificar que la persona existe
        const persona =
            await this.prisma.db.orm.public.Persona.first({
                id: data.personaId,
            });

        if (!persona) {
            throw new NotFoundException(
                `No existe la persona con el id ${data.personaId}`,
            );
        }

        // Verificar que la reserva existe
        const reserva =
            await this.prisma.db.orm.public.Reserva.first({
                id: data.reservaId,
            });

        if (!reserva) {
            throw new NotFoundException(
                `No existe la reserva con el id ${data.reservaId}`,
            );
        }

        // El titular no puede ser también acompañante
        if (reserva.titularId === data.personaId) {
            throw new ConflictException(
                'El titular de la reserva no puede registrarse como acompañante.',
            );
        }

        // Verificar que no esté repetido
        const existente =
            await this.prisma.db.orm.public.Acompanante.first({
                reservaId: data.reservaId,
                personaId: data.personaId,
            });

        if (existente) {
            throw new ConflictException(
                'Esta persona ya está registrada como acompañante de la reserva.',
            );
        }

        // Verificar que la persona tiene fecha de nacimiento
        if (!persona.fechaNacimiento) {
            throw new ConflictException(
                'La persona debe tener fecha de nacimiento para registrarla como acompañante.',
            );
        }
        const tipoHuesped = this.calcularTipoHuesped(
            persona.fechaNacimiento,
        );

        return await this.prisma.db.orm.public.Acompanante.create({
            reservaId: data.reservaId,
            personaId: data.personaId,
            tipoHuesped: tipoHuesped,
        });
    }

    private calcularTipoHuesped(
        fechaNacimiento: Temporal.Instant,
    ): 'ADULTO' | 'NINO' | 'BEBE' {
        const hoy = Temporal.Now.plainDateISO();

        const nacimiento = fechaNacimiento
            .toZonedDateTimeISO('UTC')
            .toPlainDate();

        let edad = hoy.year - nacimiento.year;

        if (
            hoy.month < nacimiento.month ||
            (hoy.month === nacimiento.month && hoy.day < nacimiento.day)
        ) {
            edad--;
        }

        if (edad <= 3) {
            return 'BEBE';
        }

        // Regla provisional.
        // Debemos definir oficialmente la edad máxima de NINO.
        if (edad <= 12) {
            return 'NINO';
        }

        return 'ADULTO';
    }
}