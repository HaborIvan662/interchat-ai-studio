
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';
import { Attachment, ChatConfig } from '@/pages/Chat';

interface ChatInputProps {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  disabled: boolean;
  config: ChatConfig;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
  config,
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: Attachment[] = files.map(file => ({
      id: crypto.randomUUID(),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' :
            file.type.startsWith('audio/') ? 'audio' : 'data',
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  return (
    <Card className="p-4 border-t">
      <form onSubmit={handleSubmit} className="space-y-3">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-2 bg-muted px-2 py-1 rounded text-sm">
                <span>{attachment.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAttachments(prev => prev.filter(a => a.id !== attachment.id))}
                  className="h-4 w-4 p-0"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={disabled}
              rows={1}
              className="min-h-[40px] resize-none"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            {config.enableVoice && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleVoiceInput}
                disabled={disabled}
                className={isListening ? 'bg-red-500 text-white' : ''}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={disabled || !message.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
