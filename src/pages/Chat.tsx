
import React, { useState, useRef, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { ConfigPanel } from '@/components/chat/ConfigPanel';
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
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<ChatConfig>({
    mode: 'basic',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1000,
    enableVoice: true,
    enableAnnotations: true,
  });

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

    // Simulate AI response - replace with actual API call
    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: `I received your message: "${content}". ${attachments.length > 0 ? `I also see you've attached ${attachments.length} file(s).` : ''} How can I help you further?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
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
