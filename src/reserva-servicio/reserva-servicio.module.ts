import { Module } from '@nestjs/common';
import { ReservaServicioController } from './reserva-servicio.controller.js';
import { ReservaServicioService } from './reserva-servicio.service.js';

@Module({
  controllers: [ReservaServicioController],
  providers: [ReservaServicioService]
})
export class ReservaServicioModule {}
