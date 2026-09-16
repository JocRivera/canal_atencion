import { Injectable } from '@nestjs/common';

import {
  OllamaMessage,
  OllamaService,
} from './ollama.service.js';
import { HOSTERIA_SYSTEM_PROMPT } from '../prompt/hosteria.prompt.js';

import { ConsultarPlanesSkill } from '../skills/plan/consultar-planes.skill.js';
import { consultarPlanesTool } from '../skills/plan/consultar-planes.types.js';

@Injectable()
export class AgenteService {
  constructor(
    private readonly ollamaService: OllamaService,
    private readonly consultarPlanesSkill: ConsultarPlanesSkill,
  ) {}

  async procesarMensaje(mensaje: string): Promise<string> {
    const messages: OllamaMessage[] = [
      {
        role: 'system',
        content: HOSTERIA_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: mensaje,
      },
    ];

    const tools = [consultarPlanesTool];

    const respuesta =
      await this.ollamaService.generarRespuesta(
        messages,
        tools,
      );

    const message = respuesta.message;

    if (!message.tool_calls?.length) {
      return message.content;
    }

    for (const toolCall of message.tool_calls) {
      const nombre = toolCall.function.name;

      if (nombre === 'consultar_planes') {
        const resultado =
          await this.consultarPlanesSkill.ejecutar();

        messages.push({
          role: 'assistant',
          content: message.content ?? '',
          tool_calls: message.tool_calls,
        });

        messages.push({
          role: 'tool',
          content: JSON.stringify(resultado),
        });
      }
    }

    const respuestaFinal =
      await this.ollamaService.generarRespuesta(
        messages,
        tools,
      );

    return respuestaFinal.message.content;
  }
}