import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { CrearAcompananteDto } from './dto/crear-acompanante.dto.js';
import { AcompanantesService } from './acompañantes.service.js';

@Controller('acompanantes')
export class AcompanantesController {
  constructor(
    private readonly acompanantesService: AcompanantesService,
  ) {}

  @Get()
  obtenerTodos() {
    return this.acompanantesService.obtenerTodos();
  }
  
  @Get('reserva/:reservaId')
  obtenerPorReserva(@Param('reservaId') reservaId: string) {
    return this.acompanantesService.obtenerPorReserva(reservaId);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.acompanantesService.obtenerPorId(id);
  }


  @Post()
  crear(@Body() data: CrearAcompananteDto) {
    return this.acompanantesService.crear(data);
  }
}