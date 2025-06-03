
import OpenAI from 'openai';
import { ChatConfig } from '@/pages/Chat';

export class OpenAIService {
  private openai: OpenAI | null = null;
  private apiKey: string = '';

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Only for frontend usage
      });
    } else {
      this.openai = null;
    }
  }

  getApiKey(): string {
    return this.apiKey;
  }

  isConfigured(): boolean {
    return !!this.openai && !!this.apiKey;
  }

  async sendMessage(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    config: ChatConfig
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: config.model,
        messages: messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      });

      return response.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get response from OpenAI');
    }
  }
}

export const openaiService = new OpenAI Service();
