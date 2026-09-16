import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';

import { ProgramacionService } from './programacion.service.js';
import { CrearProgramacionPlanDto } from './dto/crear-programacion-plan.dto.js';
import { ActualizarProgramacionPlanDto } from './dto/actualizar-programacion-plan.dto.js';

@Controller('programacion-planes')
export class ProgramacionController {
    constructor(
        private readonly programacionService: ProgramacionService,
    ) { }

    @Get()
    obtenerTodas() {
        return this.programacionService.obtenerTodas();
    }

    @Get('plan/:planId')
    obtenerPorPlan(@Param('planId') planId: string) {
        return this.programacionService.obtenerPorPlan(planId);
    }

    @Get(':id')
    obtenerPorId(@Param('id') id: string) {
        return this.programacionService.obtenerPorId(id);
    }

    @Post()
    crear(@Body() data: CrearProgramacionPlanDto) {
        return this.programacionService.crear(data);
    }

    @Patch(':id')
    actualizar(
        @Param('id') id: string,
        @Body() data: ActualizarProgramacionPlanDto,
    ) {
        return this.programacionService.actualizar(
            id,
            data,
        );
    }

    @Patch(':id/activar')
    activar(@Param('id') id: string) {
        return this.programacionService.activar(id);
    }

    @Patch(':id/desactivar')
    desactivar(@Param('id') id: string) {
        return this.programacionService.desactivar(id);
    }
}