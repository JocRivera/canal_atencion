import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PlanService } from './plan.service.js';
import { CrearPlanDto } from './dto/crear-plan.dto.js';
import { ActualizarPlanDto } from './dto/actualizar-plan.dto.js';

@Controller('planes')
export class PlanController {
  constructor(
    private readonly PlanService: PlanService,
  ) {}

  @Get()
  obtenerTodos() {
    return this.PlanService.obtenerTodos();
  }

  @Get('nombre/:nombre')
  obtenerPorNombre(@Param('nombre') nombre: string) {
    return this.PlanService.obtenerPorNombre(nombre);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.PlanService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() data: CrearPlanDto) {
    return this.PlanService.crear(data);
  }

  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() data: ActualizarPlanDto,
  ) {
    return this.PlanService.actualizar(id, data);
  }
}