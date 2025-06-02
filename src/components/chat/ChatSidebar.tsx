
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/pages/Chat';
import { MessageCircle } from 'lucide-react';

interface ChatSidebarProps {
  messages: Message[];
  onNewChat: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  onNewChat,
}) => {
  const chatSessions = [
    { id: '1', title: 'Current Chat', messageCount: messages.length },
  ];

  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="p-4 border-b">
        <Button onClick={onNewChat} className="w-full">
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.messageCount} messages
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
