import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { WebhookService } from './webhook.service.js';

@Controller('webhooks/whatsapp')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  verificar(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() response: Response,
  ) {
    const resultado = this.webhookService.verificarWhatsapp(
      mode,
      token,
      challenge,
    );

    if (resultado === null) {
      return response.sendStatus(HttpStatus.FORBIDDEN);
    }

    return response.status(HttpStatus.OK).send(resultado);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  recibir(@Body() payload: Record<string, unknown>) {
    return this.webhookService.recibirWhatsapp(payload);
  }
}