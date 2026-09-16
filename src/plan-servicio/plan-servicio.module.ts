import { Module } from '@nestjs/common';
import { PlanServicioService } from './plan-servicio.service.js';
import { PlanServicioController } from './plan-servicio.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js'; // Ajusta la ruta relativa

@Module({
  imports: [PrismaModule], // <-- Importa el módulo aquí
  controllers: [PlanServicioController],
  providers: [PlanServicioService],
})
export class PlanServicioModule {}