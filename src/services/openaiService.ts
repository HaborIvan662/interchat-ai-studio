
import OpenAI from 'openai';
import { ChatConfig, Attachment } from '@/pages/Chat';

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

  private async processAttachments(attachments: Attachment[]): Promise<string> {
    if (!attachments || attachments.length === 0) return '';

    let attachmentText = '\n\nAttached files:\n';
    
    for (const attachment of attachments) {
      attachmentText += `- ${attachment.name} (${attachment.type})`;
      
      if (attachment.type === 'text') {
        try {
          const response = await fetch(attachment.url);
          const text = await response.text();
          attachmentText += `:\n${text}\n`;
        } catch (error) {
          attachmentText += `: [Could not read text file]\n`;
        }
      } else if (attachment.type === 'image') {
        attachmentText += `: [Image file - you can see this image]\n`;
      } else {
        attachmentText += `\n`;
      }
    }
    
    return attachmentText;
  }

  async sendMessage(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    config: ChatConfig,
    attachments?: Attachment[]
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // Process the last message to include attachment information
      const processedMessages = [...messages];
      if (attachments && attachments.length > 0 && processedMessages.length > 0) {
        const lastMessage = processedMessages[processedMessages.length - 1];
        const attachmentInfo = await this.processAttachments(attachments);
        lastMessage.content += attachmentInfo;
      }

      const response = await this.openai.chat.completions.create({
        model: config.model,
        messages: processedMessages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      });

      return response.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      console.error('OpenAI API error:', error);
      if (error instanceof Error && error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      }
      throw new Error('Failed to get response from OpenAI');
    }
  }
}

export const openaiService = new OpenAIService();
