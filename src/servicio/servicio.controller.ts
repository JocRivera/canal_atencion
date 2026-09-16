import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ServicioService } from './servicio.service.js';
import { CrearServicioDto } from './dto/crear-servicio.dto.js';
import { ActualizarServicioDto } from './dto/actualizar-servicio.dto.js';

@Controller('servicios')
export class ServicioController {
  constructor(
    private readonly serviciosService: ServicioService,
  ) {}

  @Get()
  obtenerTodos() {
    return this.serviciosService.obtenerTodos();
  }

  @Get('nombre/:nombre')
  obtenerPorNombre(@Param('nombre') nombre: string) {
    return this.serviciosService.obtenerPorNombre(nombre);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.serviciosService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() data: CrearServicioDto) {
    return this.serviciosService.crear(data);
  }

  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() data: ActualizarServicioDto,
  ) {
    return this.serviciosService.actualizar(id, data);
  }
}