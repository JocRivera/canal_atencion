import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PersonasModule } from './personas/personas.module.js';
import { AcompanantesModule } from './acompañantes/acompañantes.module.js';

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
  PrismaModule,
    PersonasModule,
    AcompanantesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
