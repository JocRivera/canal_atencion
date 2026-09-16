import { Module } from '@nestjs/common';
import { ServicioService } from './servicio.service.js';
import { ServicioController } from './servicio.controller.js';

@Module({
  providers: [ServicioService],
  controllers: [ServicioController]
})
export class ServicioModule {}
