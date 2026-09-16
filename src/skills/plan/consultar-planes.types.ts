import type { OllamaTool } from '../../agente/ollama.service.js';

export const consultarPlanesTool: OllamaTool = {
  type: 'function',
  function: {
    name: 'consultar_planes',
    description:
      'Consulta los planes disponibles de la hostería. ' +
      'Utiliza esta herramienta cuando el cliente pregunte ' +
      'qué planes existen, sus precios o sus características.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
};