import {
  Body,
  Controller,
  Post,
  Get,
} from '@nestjs/common';

import { AgenteService } from './agente.service.js';

@Controller('agente')
export class AgenteController {
  constructor(
    private readonly agenteService: AgenteService,
  ) {}

  @Post('mensaje')
  async procesarMensaje(
    @Body('mensaje') mensaje: string,
  ) {
    return {
      respuesta:
        await this.agenteService.procesarMensaje(
          mensaje,
        ),
    };
  }
}