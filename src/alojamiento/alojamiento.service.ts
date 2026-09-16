import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CrearAlojamientoDto } from './dto/crear-alojamiento.dto.js';
import { ActualizarAlojamientoDto } from './dto/actualizar-alojamiento.dto.js';

@Injectable()
export class AlojamientoService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos() {
    return await this.prisma.db.orm.public.Alojamiento.all();
  }

  async obtenerPorId(id: string) {
    const alojamiento =
      await this.prisma.db.orm.public.Alojamiento.first({
        id,
      });

    if (!alojamiento) {
      throw new NotFoundException(
        `No existe el alojamiento con el id ${id}.`,
      );
    }

    return alojamiento;
  }

  async obtenerPorTipo(tipo: 'HABITACION' | 'CABANA') {
    return this.prisma.db.orm.public.Alojamiento
      .where({ tipo })
      .all();
  }

  async crear(data: CrearAlojamientoDto) {
    const existente =
      await this.prisma.db.orm.public.Alojamiento.first({
        nombre: data.nombre,
      });

    if (existente) {
      throw new ConflictException(
        `Ya existe un alojamiento llamado "${data.nombre}".`,
      );
    }

    return await this.prisma.db.orm.public.Alojamiento.create({
      nombre: data.nombre,
      tipo: data.tipo,
      capacidad: data.capacidad,
      descripcion: data.descripcion,
      estado: 'OPERATIVO',
    });
  }

  async actualizar(
    id: string,
    data: ActualizarAlojamientoDto,
  ) {
    const alojamiento = await this.obtenerPorId(id);

    if (data.nombre) {
      const existente =
        await this.prisma.db.orm.public.Alojamiento.first({
          nombre: data.nombre,
        });

      if (
        existente &&
        existente.id !== alojamiento.id
      ) {
        throw new ConflictException(
          `Ya existe un alojamiento llamado "${data.nombre}".`,
        );
      }
    }

    return await this.prisma.db.orm.public.Alojamiento
      .where({ id })
      .update({
        nombre: data.nombre,
        tipo: data.tipo,
        capacidad: data.capacidad,
        descripcion: data.descripcion,
        estado: data.estado,
      });
  }
}