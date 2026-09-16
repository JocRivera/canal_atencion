import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ReservaService } from './reserva.service.js';
import { CrearReservaDto } from './dto/crear-reserva.dto.js';
import { ActualizarReservaDto } from './dto/actualizar-reserva.dto.js';
import { ConsultarDisponibilidadDto } from './dto/consultar-disponibilidad.dto.js';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Get()
  obtenerTodas() {
    return this.reservaService.obtenerTodas();
  }

  @Get('titular/:titularId')
  obtenerPorTitular(@Param('titularId') titularId: string) {
    return this.reservaService.obtenerPorTitular(titularId);
  }

  @Get('disponibles')
  obtenerAlojamientosDisponibles(
    @Query() data: ConsultarDisponibilidadDto,
  ) {
    return this.reservaService.obtenerAlojamientosDisponibles(
      data.fechaIngreso,
      data.fechaSalida,
      data.cantidadHuespedes,
    );
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.reservaService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() data: CrearReservaDto) {
    return this.reservaService.crear(data);
  }

  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() data: ActualizarReservaDto,
  ) {
    return this.reservaService.actualizar(id, data);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.reservaService.cancelar(id);
  }
}