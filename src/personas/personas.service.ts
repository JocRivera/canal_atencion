import { Injectable, NotFoundException, ConflictException  } from '@nestjs/common';
import { Temporal } from 'temporal-polyfill';
import { CrearPersonaDto } from './dto/crear-persona.dto.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PersonasService {
  constructor(private readonly prisma: PrismaService) {}

    async obtenerPersonas() {
        return await this.prisma.db.orm.public.Persona.all();
    }

    async obtenerPersonaPorId(id: string) {
        const persona = await this.prisma.db.orm.public.Persona.first({ id });
        if (!persona) {
            throw new NotFoundException(
                `No existe una persona con el id ${id}`,
            );
        }

        return persona;
    }

    async obtenerPersonaPorDocumento(documento: string) {
        const persona = await this.prisma.db.orm.public.Persona.first({ documento });
        if (!persona) {
            throw new NotFoundException(
                `No existe una persona con el documento ${documento}`,
            );
        }

        return persona;
    }

    async obtenerPersonaPorContacto(contacto: string) {
        const persona = await this.prisma.db.orm.public.Persona.first({
            contacto,
        });

        if (!persona) {
            throw new NotFoundException(
                `No existe una persona con el contacto ${contacto}`,
            );
        }

        return persona;
    }

    async crearPersona(data: CrearPersonaDto) {
        const personaExistente =
            await this.prisma.db.orm.public.Persona.first({ documento: data.documento });

        if (personaExistente) {
            throw new ConflictException(
                `Ya existe una persona con el documento ${data.documento}`,
            );
        }
        return await this.prisma.db.orm.public.Persona.create({
            tipoDocumento: data.tipoDocumento,
            documento: data.documento,
            nombre: data.nombre,

            fechaNacimiento: data.fechaNacimiento
                ? Temporal.Instant.from(`${data.fechaNacimiento}T00:00:00Z`)
                : undefined,

            contacto: data.contacto,
            email: data.email,
            eps: data.eps,
        });
    }
    
    async actualizarPersona(id: string, data: CrearPersonaDto) {
        const persona = await this.prisma.db.orm.public.Persona
            .where({ id })
            .update({
                tipoDocumento: data.tipoDocumento,
                documento: data.documento,
                nombre: data.nombre,
                fechaNacimiento: data.fechaNacimiento
                    ? Temporal.Instant.from(`${data.fechaNacimiento}T00:00:00Z`)
                    : undefined,
                contacto: data.contacto,
                email: data.email,
                eps: data.eps,
            });

        if (!persona) {
            throw new NotFoundException(
                `No existe una persona con el id ${id}`,
            );
        }

        return persona;
    }
}