import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CrearServicioDto } from './dto/crear-servicio.dto.js';
import { ActualizarServicioDto } from './dto/actualizar-servicio.dto.js';

@Injectable()
export class ServicioService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos() {
    return await this.prisma.db.orm.public.Servicio.all();
  }

  async obtenerPorId(id: string) {
    const servicio =
      await this.prisma.db.orm.public.Servicio.first({
        id,
      });

    if (!servicio) {
      throw new NotFoundException(
        `No existe el servicio con el id ${id}`,
      );
    }

    return servicio;
  }

  async obtenerPorNombre(nombre: string) {
    const servicio =
      await this.prisma.db.orm.public.Servicio.first({
        nombre,
      });

    if (!servicio) {
      throw new NotFoundException(
        `No existe el servicio "${nombre}".`,
      );
    }

    return servicio;
  }

  async crear(data: CrearServicioDto) {
    const existente =
      await this.prisma.db.orm.public.Servicio.first({
        nombre: data.nombre,
      });

    if (existente) {
      throw new ConflictException(
        `Ya existe un servicio llamado "${data.nombre}".`,
      );
    }

    return await this.prisma.db.orm.public.Servicio.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      soloRomantico: data.soloRomantico ?? false,
    });
  }

  async actualizar(
    id: string,
    data: ActualizarServicioDto,
  ) {
    await this.obtenerPorId(id);

    if (data.nombre) {
      const existente =
        await this.prisma.db.orm.public.Servicio.first({
          nombre: data.nombre,
        });

      if (existente && existente.id !== id) {
        throw new ConflictException(
          `Ya existe un servicio llamado "${data.nombre}".`,
        );
      }
    }

    return await this.prisma.db.orm.public.Servicio
      .where({ id })
      .update({
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        soloRomantico: data.soloRomantico,
      });
  }
}