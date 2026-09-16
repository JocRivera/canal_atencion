import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: any[];
}

export interface OllamaTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

@Injectable()
export class OllamaService {
  private readonly url = 'http://localhost:11434';
  private readonly modelo = 'qwen3.5:9b';

  async generarRespuesta(
    messages: OllamaMessage[],
    tools: OllamaTool[] = [],
  ) {
    try {
      const response = await fetch(
        `${this.url}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.modelo,
            messages,
            tools,
            stream: false,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Ollama respondió con estado ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(
        'Error comunicándose con Ollama:',
        error,
      );

      throw new InternalServerErrorException(
        'No fue posible comunicarse con el modelo de IA.',
      );
    }
  }
}