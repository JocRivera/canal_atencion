import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PersonasModule } from './personas/personas.module.js';
import { AcompanantesModule } from './acompañantes/acompañantes.module.js';
import { PlanModule } from './plan/plan.module.js';
import { ProgramacionController } from './programacion/programacion.controller.js';
import { ProgramacionService } from './programacion/programacion.service.js';
import { ProgramacionModule } from './programacion/programacion.module.js';
import { ServicioModule } from './servicio/servicio.module.js';
import { AlojamientoController } from './alojamiento/alojamiento.controller.js';
import { AlojamientoService } from './alojamiento/alojamiento.service.js';
import { AlojamientoModule } from './alojamiento/alojamiento.module.js';

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
  PrismaModule,
    PersonasModule,
    AcompanantesModule,
    PlanModule,
    ProgramacionModule,
    ServicioModule,
    AlojamientoModule,
  ],
  controllers: [AppController, ProgramacionController, AlojamientoController],
  providers: [AppService, ProgramacionService, AlojamientoService],
})
export class AppModule {}
