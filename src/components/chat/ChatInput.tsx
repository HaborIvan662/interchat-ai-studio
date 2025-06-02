
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Paperclip, Mic, MicOff, X, Image, FileText } from 'lucide-react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
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
    
    // Reset file input
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-3 w-3" />;
      case 'video':
        return <FileText className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div className="border-t bg-background p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-2 bg-muted px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm border">
                {getAttachmentIcon(attachment.type)}
                <span className="max-w-20 sm:max-w-32 truncate">{attachment.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-4 w-4 sm:h-5 sm:w-5 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Input Area */}
        <Card className="border-2 border-border hover:border-primary/50 transition-colors">
          <form onSubmit={handleSubmit} className="p-2 sm:p-3">
            <div className="flex gap-2 sm:gap-3 items-end">
              {/* Text Input */}
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={disabled}
                  className="min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px] resize-none border-0 bg-transparent p-2 sm:p-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base"
                  style={{ height: '40px' }}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-1">
                {/* File Upload */}
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={disabled}
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-muted"
                  title="Attach files"
                >
                  <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                
                {/* Voice Input - Hidden on very small screens */}
                {config.enableVoice && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleVoiceInput}
                    disabled={disabled}
                    className={`h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-muted hidden xs:flex ${
                      isListening ? 'bg-red-500 text-white hover:bg-red-600' : ''
                    }`}
                    title={isListening ? 'Stop recording' : 'Start voice input'}
                  >
                    {isListening ? <MicOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  </Button>
                )}
                
                {/* Send Button */}
                <Button
                  type="submit"
                  disabled={disabled || !message.trim()}
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                  title="Send message"
                >
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </form>
        </Card>
        
        {/* Helper Text */}
        <div className="mt-2 text-xs text-muted-foreground text-center hidden sm:block">
          Press Enter to send • Shift + Enter for new line • Attach files up to 10MB
        </div>
      </div>
    </div>
  );
};
