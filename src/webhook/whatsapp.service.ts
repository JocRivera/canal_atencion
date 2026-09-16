import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class WhatsappService {
  async enviarTexto(destinatario: string, texto: string) {
    const version = process.env.WHATSAPP_API_VERSION ?? 'v23.0';
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      throw new InternalServerErrorException(
        'Faltan las credenciales de WhatsApp.',
      );
    }

    const response = await fetch(
      `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: destinatario,
          type: 'text',
          text: {
            preview_url: false,
            body: texto,
          },
        }),
      },
    );

    if (!response.ok) {
      const detalle = await response.text();
      throw new InternalServerErrorException(
        `WhatsApp rechazó el mensaje: ${detalle}`,
      );
    }

    return response.json();
  }
}
