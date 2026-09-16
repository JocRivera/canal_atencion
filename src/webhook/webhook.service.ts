import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

type WhatsappMessage = {
  id?: string;
  from?: string;
  type?: string;
  text?: { body?: string };
};

type WhatsappWebhookPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: WhatsappMessage[];
      };
    }>;
  }>;
};

export type MensajeEntrante = {
  canal: 'whatsapp';
  identificadorExterno: string;
  mensajeId?: string;
  texto: string;
  tipo: string;
};

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly prisma: PrismaService) {}

  verificarWhatsapp(mode: string, token: string, challenge: string) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (
      mode !== 'subscribe' ||
      !verifyToken ||
      token !== verifyToken
    ) {
      return null;
    }

    return challenge;
  }

  async recibirWhatsapp(
    payload: WhatsappWebhookPayload,
  ): Promise<{ recibido: boolean; mensajes: MensajeEntrante[] }> {
    const mensajes = this.extraerMensajes(payload);

    for (const mensaje of mensajes) {
      await this.guardarMensaje(mensaje);
    }

    return {
      recibido: true,
      mensajes,
    };
  }

  private extraerMensajes(
    payload: WhatsappWebhookPayload,
  ): MensajeEntrante[] {
    const mensajes: MensajeEntrante[] = [];

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        for (const message of change.value?.messages ?? []) {
          if (!message.from) {
            continue;
          }

          mensajes.push({
            canal: 'whatsapp',
            identificadorExterno: message.from,
            mensajeId: message.id,
            texto: message.text?.body?.trim() ?? '',
            tipo: message.type ?? 'unknown',
          });
        }
      }
    }

    return mensajes;
  }

  private async guardarMensaje(mensaje: MensajeEntrante) {
    const conversacion =
      await this.prisma.db.orm.public.Conversacion.first({
        canal: mensaje.canal,
        identificadorExterno: mensaje.identificadorExterno,
      });

    const contextoAnterior = conversacion?.contexto
      ? JSON.parse(conversacion.contexto)
      : { mensajes: [] };
    const mensajes = Array.isArray(contextoAnterior.mensajes)
      ? contextoAnterior.mensajes
      : [];

    if (
      mensaje.mensajeId &&
      mensajes.some(
        (item: { id?: string }) => item.id === mensaje.mensajeId,
      )
    ) {
      return;
    }

    mensajes.push({
      id: mensaje.mensajeId,
      texto: mensaje.texto,
      tipo: mensaje.tipo,
      recibidoEn: new Date().toISOString(),
    });

    const contexto = JSON.stringify({ mensajes });

    if (conversacion) {
      await this.prisma.db.orm.public.Conversacion
        .where({ id: conversacion.id })
        .update({
          contexto,
          ultimoMensajeId: mensaje.mensajeId,
        });
      return;
    }

    await this.prisma.db.orm.public.Conversacion.create({
      canal: mensaje.canal,
      identificadorExterno: mensaje.identificadorExterno,
      estado: 'INICIO',
      contexto,
      ultimoMensajeId: mensaje.mensajeId,
    });

    this.logger.debug(
      `Conversación creada para ${mensaje.identificadorExterno}`,
    );
  }
}