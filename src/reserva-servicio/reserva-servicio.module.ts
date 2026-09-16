import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ReservaServicioController } from './reserva-servicio.controller.js';
import { ReservaServicioService } from './reserva-servicio.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ReservaServicioController],
  providers: [ReservaServicioService]
})
export class ReservaServicioModule {}
