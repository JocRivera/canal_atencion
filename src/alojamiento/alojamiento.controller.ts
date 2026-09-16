import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AlojamientoService } from './alojamiento.service.js';
import { CrearAlojamientoDto } from './dto/crear-alojamiento.dto.js';
import { ActualizarAlojamientoDto } from './dto/actualizar-alojamiento.dto.js';

@Controller('alojamiento')
export class AlojamientoController {
  constructor(
    private readonly alojamientoService: AlojamientoService,
  ) {}

  @Get()
  obtenerTodos() {
    return this.alojamientoService.obtenerTodos();
  }

  @Get('tipo/:tipo')
  obtenerPorTipo(
    @Param('tipo')
    tipo: 'HABITACION' | 'CABANA',
  ) {
    return this.alojamientoService.obtenerPorTipo(tipo);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.alojamientoService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() data: CrearAlojamientoDto) {
    return this.alojamientoService.crear(data);
  }

  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() data: ActualizarAlojamientoDto,
  ) {
    return this.alojamientoService.actualizar(
      id,
      data,
    );
  }
}