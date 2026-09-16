import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { ServicioController } from './servicio.controller.js';
import { ServicioService } from './servicio.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ServicioController],
  providers: [ServicioService],
})
export class ServicioModule {}