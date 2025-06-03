
import OpenAI from 'openai';
import { ChatConfig, Attachment } from '@/pages/Chat';

export class OpenAIService {
  private openai: OpenAI | null = null;
  private apiKey: string = '';

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    if (apiKey && this.isValidApiKey(apiKey)) {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
        defaultHeaders: {
          'OpenAI-Beta': 'assistants=v1'
        }
      });
    } else {
      this.openai = null;
    }
  }

  private isValidApiKey(apiKey: string): boolean {
    return apiKey.startsWith('sk-') && apiKey.length > 20;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  isConfigured(): boolean {
    return !!this.openai && !!this.apiKey && this.isValidApiKey(this.apiKey);
  }

  private async processAttachments(attachments: Attachment[]): Promise<any[]> {
    if (!attachments || attachments.length === 0) return [];

    const processedAttachments = [];
    
    for (const attachment of attachments) {
      if (attachment.type === 'image') {
        processedAttachments.push({
          type: 'image_url',
          image_url: {
            url: attachment.url
          }
        });
      } else if (attachment.type === 'text') {
        try {
          const response = await fetch(attachment.url);
          const text = await response.text();
          processedAttachments.push({
            type: 'text',
            text: `File: ${attachment.name}\n${text}`
          });
        } catch (error) {
          console.error('Failed to read text file:', error);
        }
      }
    }
    
    return processedAttachments;
  }

  async sendMessage(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    config: ChatConfig,
    attachments?: Attachment[]
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured or invalid. Please check your API key format.');
    }

    try {
      // Process attachments for the last message
      const processedMessages = [...messages];
      if (attachments && attachments.length > 0 && processedMessages.length > 0) {
        const lastMessage = processedMessages[processedMessages.length - 1];
        const attachmentContent = await this.processAttachments(attachments);
        
        if (attachmentContent.length > 0) {
          // For GPT-4 vision, we need to format the content differently
          const contentArray = [{ type: 'text', text: lastMessage.content }];
          contentArray.push(...attachmentContent);
          
          processedMessages[processedMessages.length - 1] = {
            ...lastMessage,
            content: contentArray as any
          };
        }
      }

      const response = await this.openai!.chat.completions.create({
        model: config.model,
        messages: processedMessages as any,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      });

      return response.choices[0]?.message?.content || 'No response received';
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      if (error.message?.includes('fetch')) {
        throw new Error('Network error: Unable to connect to OpenAI. This might be due to browser security restrictions. Consider using a backend proxy for production apps.');
      }
      
      if (error.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      }
      
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`OpenAI API error: ${error.message || 'Unknown error occurred'}`);
    }
  }
}

export const openaiService = new OpenAIService();
