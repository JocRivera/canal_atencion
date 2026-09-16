import { Module } from '@nestjs/common';

import { AgenteModule } from '../agente/agente.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { WebhookController } from './webhook.controller.js';
import { WebhookService } from './webhook.service.js';
import { WhatsappService } from './whatsapp.service.js';

@Module({
  imports: [PrismaModule, AgenteModule],
  controllers: [WebhookController],
  providers: [WebhookService, WhatsappService],
  exports: [WebhookService],
})
export class WebhookModule {}