
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Sparkles } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { LoadingIndicator } from './LoadingIndicator';
import { Message, MessageFeedback, ChatConfig } from '@/pages/Chat';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onFeedback: (messageId: string, feedback: MessageFeedback) => void;
  onReprompt: (originalMessage: Message, newContent: string) => void;
  config: ChatConfig;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onFeedback,
  onReprompt,
  config,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 bg-gradient-to-b from-background to-muted/20" ref={scrollRef}>
      <div className="p-6 max-w-4xl mx-auto min-h-full">
        {messages.length === 0 && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Start a conversation
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                Send a message to begin chatting with your AI assistant
              </p>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-card border rounded-lg p-3 text-left">
                  <span className="font-medium">💬</span> Ask questions about anything
                </div>
                <div className="bg-card border rounded-lg p-3 text-left">
                  <span className="font-medium">📎</span> Upload images, documents, or files
                </div>
                <div className="bg-card border rounded-lg p-3 text-left">
                  <span className="font-medium">🎤</span> Use voice input for natural conversation
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={message.id} className="animate-fade-in">
              <MessageBubble
                message={message}
                onFeedback={onFeedback}
                onReprompt={onReprompt}
                showAdvancedControls={config.mode === 'advanced'}
              />
            </div>
          ))}
          
          {isLoading && (
            <div className="animate-fade-in">
              <LoadingIndicator />
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
