import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { WebhookController } from './webhook.controller.js';
import { WebhookService } from './webhook.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}