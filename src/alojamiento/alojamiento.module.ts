import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AlojamientoController } from './alojamiento.controller.js';
import { AlojamientoService } from './alojamiento.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [AlojamientoController],
  providers: [AlojamientoService],
})
export class AlojamientoModule {}