
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
            <p>Send a message to begin chatting with the AI assistant</p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onFeedback={onFeedback}
            onReprompt={onReprompt}
            showAdvancedControls={config.mode === 'advanced'}
          />
        ))}
        
        {isLoading && <LoadingIndicator />}
      </div>
    </ScrollArea>
  );
};
