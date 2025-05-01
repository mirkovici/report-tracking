const OPENAI_API_KEY = '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'; // Replace or inject via env
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

export class OpenAIService {
  static async generateDraft(prompt: string): Promise<string> {
    const systemPrompt = 'You are a helpful assistant that writes professional reports.';

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4', // or gpt-3.5-turbo
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a report draft about: ${prompt}` },
        ],
        temperature: 0.7,
      }),
    });

    const json = await response.json();
    return json.choices?.[0]?.message?.content?.trim() || '';
  }

  static async summarizeContent(content: string): Promise<string> {
    const systemPrompt = 'You are an assistant that summarizes reports concisely.';

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4', // or gpt-3.5-turbo
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Summarize the following report:\n\n${content}` },
        ],
        temperature: 0.5,
      }),
    });

    const json = await response.json();
    return json.choices?.[0]?.message?.content?.trim() || '';
  }
}

