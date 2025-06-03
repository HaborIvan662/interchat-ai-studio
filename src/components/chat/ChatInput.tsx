
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Paperclip, Mic, MicOff, X, Image, FileText, Edit } from 'lucide-react';
import { Attachment, ChatConfig } from '@/pages/Chat';
import { speechService } from '@/services/speechService';

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      setIsEditMode(false);
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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // Create file URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      // Determine file type
      let fileType: 'image' | 'video' | 'audio' | 'text' | 'data' = 'data';
      if (file.type.startsWith('image/')) fileType = 'image';
      else if (file.type.startsWith('video/')) fileType = 'video';
      else if (file.type.startsWith('audio/')) fileType = 'audio';
      else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) fileType = 'text';

      const newAttachment: Attachment = {
        id: crypto.randomUUID(),
        type: fileType,
        name: file.name,
        url: fileUrl,
        size: file.size,
      };

      setAttachments(prev => [...prev, newAttachment]);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id);
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter(a => a.id !== id);
    });
  };

  const toggleVoiceInput = async () => {
    if (!speechService.isSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setInterimTranscript('');
    } else {
      try {
        await speechService.startListening(
          (transcript, isFinal) => {
            if (isFinal) {
              setMessage(prev => prev + transcript + ' ');
              setInterimTranscript('');
            } else {
              setInterimTranscript(transcript);
            }
          },
          (error) => {
            console.error('Speech recognition error:', error);
            setIsListening(false);
            setInterimTranscript('');
          }
        );
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-3 w-3" />;
      case 'video':
      case 'audio':
      case 'text':
        return <FileText className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const displayText = message + (isListening ? interimTranscript : '');

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
                {attachment.type === 'image' && (
                  <img src={attachment.url} alt={attachment.name} className="w-6 h-6 object-cover rounded" />
                )}
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
        <Card className={`border-2 transition-colors ${
          isEditMode ? 'border-primary' : 'border-border hover:border-primary/50'
        }`}>
          <form onSubmit={handleSubmit} className="p-2 sm:p-3">
            <div className="flex gap-2 sm:gap-3 items-end">
              {/* Text Input */}
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={displayText}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : "Type your message..."}
                  disabled={disabled || isListening}
                  className={`min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px] resize-none border-0 bg-transparent p-2 sm:p-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base ${
                    isListening ? 'opacity-75' : ''
                  }`}
                  style={{ height: '40px' }}
                />
                {isListening && (
                  <div className="absolute top-2 right-2 text-red-500 text-xs animate-pulse">
                    Recording...
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-1">
                {/* Edit Mode Toggle */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleEditMode}
                  disabled={disabled}
                  className={`h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-muted ${
                    isEditMode ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  title="Toggle edit mode"
                >
                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>

                {/* File Upload */}
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.md"
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-muted"
                  title="Attach files"
                >
                  <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                
                {/* Voice Input */}
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
                  disabled={disabled || !message.trim() || isListening}
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
          Press Enter to send • Shift + Enter for new line • Click 🎤 for voice input • 📎 to attach files
        </div>
      </div>
    </div>
  );
};
