export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  private static endpoint = 'http://localhost:4000/api/openai';

  static async sendMessage({
    messages,
    model = 'gpt-4',
    temperature = 0.7,
  }: {
    messages: OpenAIMessage[];
    model?: string;
    temperature?: number;
  }): Promise<OpenAIResponse> {
    const response = await fetch(OpenAIService.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, model, temperature }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error?.message || 'Failed to fetch from OpenAI');
    }

    return response.json();
  }
}