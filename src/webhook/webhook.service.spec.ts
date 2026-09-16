import { WebhookService } from './webhook.service.js';

describe('WebhookService', () => {
  let service: WebhookService;
  let prisma: any;
  let agenteService: any;
  let whatsappService: any;

  beforeEach(() => {
    prisma = {
      db: {
        orm: {
          public: {
            Conversacion: {
              first: vi.fn().mockResolvedValue(null),
              create: vi.fn().mockResolvedValue({ id: 'conversation-1' }),
              where: vi.fn(),
            },
          },
        },
      },
    };

    agenteService = {
      procesarMensaje: vi
        .fn()
        .mockResolvedValue('Respuesta del agente'),
    };
    whatsappService = {
      enviarTexto: vi.fn().mockResolvedValue({ messages: [] }),
    };

    service = new WebhookService(
      prisma,
      agenteService,
      whatsappService,
    );
  });

  it('acepta la verificación de WhatsApp con el token configurado', () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'token-local';

    expect(
      service.verificarWhatsapp(
        'subscribe',
        'token-local',
        'challenge-local',
      ),
    ).toBe('challenge-local');
  });

  it('rechaza la verificación con un token inválido', () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'token-local';

    expect(
      service.verificarWhatsapp(
        'subscribe',
        'token-invalido',
        'challenge-local',
      ),
    ).toBeNull();
  });

  it('normaliza y persiste mensajes entrantes de texto', async () => {
    const resultado = await service.recibirWhatsapp({
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: 'wamid-1',
                    from: '573001234567',
                    type: 'text',
                    text: { body: '  Buen día  ' },
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    expect(resultado.mensajes).toEqual([
      {
        canal: 'whatsapp',
        identificadorExterno: '573001234567',
        mensajeId: 'wamid-1',
        texto: 'Buen día',
        tipo: 'text',
      },
    ]);
    expect(prisma.db.orm.public.Conversacion.create).toHaveBeenCalledWith(
      expect.objectContaining({
        canal: 'whatsapp',
        identificadorExterno: '573001234567',
        estado: 'INICIO',
        ultimoMensajeId: 'wamid-1',
      }),
    );
    expect(agenteService.procesarMensaje).toHaveBeenCalledWith(
      'Buen día',
    );
    expect(whatsappService.enviarTexto).toHaveBeenCalledWith(
      '573001234567',
      'Respuesta del agente',
    );
  });
});
