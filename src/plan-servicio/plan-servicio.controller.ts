import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { PlanServicioService } from './plan-servicio.service.js';
import { AgregarServicioPlanDto } from './dto/agregar-servicio-plan.dto.js';

@Controller('planes/:planId/servicios')
export class PlanServiciosController {
  constructor(
    private readonly planServiciosService: PlanServicioService,
  ) {}

  @Get()
  obtenerServiciosDelPlan(
    @Param('planId') planId: string,
  ) {
    return this.planServiciosService.obtenerServiciosDelPlan(
      planId,
    );
  }

  @Post()
  agregarServicio(
    @Param('planId') planId: string,
    @Body() data: AgregarServicioPlanDto,
  ) {
    return this.planServiciosService.agregarServicio(
      planId,
      data,
    );
  }

  @Delete(':servicioId')
  quitarServicio(
    @Param('planId') planId: string,
    @Param('servicioId') servicioId: string,
  ) {
    return this.planServiciosService.quitarServicio(
      planId,
      servicioId,
    );
  }
}