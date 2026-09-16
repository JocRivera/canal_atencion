import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { ProgramacionController } from './programacion.controller.js';
import { ProgramacionService } from './programacion.service.js';

@Module({
    imports: [PrismaModule],
    controllers: [ProgramacionController],
    providers: [ProgramacionService],
})
export class ProgramacionModule { }