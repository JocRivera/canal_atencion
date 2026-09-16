import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AcompanantesController } from './acompañantes.controller.js';
import { AcompanantesService } from './acompañantes.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [AcompanantesController],
  providers: [AcompanantesService],
})
export class AcompanantesModule {}