
import React, { useState, useRef, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { ConfigPanel } from '@/components/chat/ConfigPanel';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  feedback?: MessageFeedback;
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'text' | 'data' | 'audio';
  name: string;
  url: string;
  size?: number;
}

export interface MessageFeedback {
  rating?: 'good' | 'bad';
  annotation?: string;
  correctedContent?: string;
}

export interface ChatConfig {
  mode: 'basic' | 'advanced';
  model: string;
  temperature: number;
  maxTokens: number;
  enableVoice: boolean;
  enableAnnotations: boolean;
  openaiApiKey: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Load config from localStorage on startup
  const [config, setConfig] = useState<ChatConfig>(() => {
    const savedConfig = localStorage.getItem('chatConfig');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (error) {
        console.error('Error parsing saved config:', error);
      }
    }
    return {
      mode: 'basic',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1000,
      enableVoice: true,
      enableAnnotations: true,
      openaiApiKey: '',
    };
  });

  // Save config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatConfig', JSON.stringify(config));
  }, [config]);

  const handleSendMessage = async (content: string, attachments: Attachment[] = []) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content,
      timestamp: new Date(),
      attachments,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Check if OpenAI is configured
      if (!config.openaiApiKey) {
        throw new Error('Please configure your OpenAI API key in settings');
      }

      // Import and configure OpenAI service
      const { openaiService } = await import('@/services/openaiService');
      openaiService.setApiKey(config.openaiApiKey);

      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      // Add current user message
      conversationHistory.push({
        role: 'user' as const,
        content: content
      });

      // Get AI response
      const aiResponse = await openaiService.sendMessage(conversationHistory, config);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageFeedback = (messageId: string, feedback: MessageFeedback) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  const handleReprompt = (originalMessage: Message, newContent: string) => {
    // Remove messages after the original one and send new prompt
    const messageIndex = messages.findIndex(msg => msg.id === originalMessage.id);
    if (messageIndex !== -1) {
      setMessages(prev => prev.slice(0, messageIndex));
      handleSendMessage(newContent);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar messages={messages} onNewChat={() => setMessages([])} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              onFeedback={handleMessageFeedback}
              onReprompt={handleReprompt}
              config={config}
            />
            
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              config={config}
            />
          </div>

          {/* Configuration Panel */}
          {showConfig && (
            <ConfigPanel
              config={config}
              onConfigChange={setConfig}
              onClose={() => setShowConfig(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
