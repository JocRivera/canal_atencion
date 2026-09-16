import { Module } from '@nestjs/common';

import { ReservaController } from './reserva.controller.js';
import { ReservaService } from './reserva.service.js';

@Module({
  controllers: [ReservaController],
  providers: [ReservaService],
  exports: [ReservaService],
})
export class ReservaModule {}