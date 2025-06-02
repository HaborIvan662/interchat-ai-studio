
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Message, MessageFeedback } from '@/pages/Chat';
import { User, Bot, ThumbsUp, ThumbsDown, Edit, RotateCcw, Copy, Check } from 'lucide-react';
import { AttachmentDisplay } from './AttachmentDisplay';

interface MessageBubbleProps {
  message: Message;
  onFeedback: (messageId: string, feedback: MessageFeedback) => void;
  onReprompt: (originalMessage: Message, newContent: string) => void;
  showAdvancedControls: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onFeedback,
  onReprompt,
  showAdvancedControls,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [annotation, setAnnotation] = useState('');
  const [correctedContent, setCorrectedContent] = useState('');
  const [showReprompt, setShowReprompt] = useState(false);
  const [repromptContent, setRepromptContent] = useState(message.content);
  const [copied, setCopied] = useState(false);

  const isUser = message.type === 'user';

  const handleFeedback = (rating: 'good' | 'bad') => {
    const feedback: MessageFeedback = {
      rating,
      annotation: annotation || undefined,
      correctedContent: correctedContent || undefined,
    };
    onFeedback(message.id, feedback);
    setShowFeedback(false);
  };

  const handleReprompt = () => {
    onReprompt(message, repromptContent);
    setShowReprompt(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
            : 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
        }`}>
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <Card className={`p-4 shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-200' 
            : 'bg-card border-border hover:border-primary/20'
        }`}>
          <div className="space-y-3">
            {/* Message Text */}
            <div className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
            
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/20">
                {message.attachments.map((attachment) => (
                  <AttachmentDisplay key={attachment.id} attachment={attachment} />
                ))}
              </div>
            )}

            {/* Message Footer */}
            <div className={`flex items-center justify-between text-xs ${
              isUser ? 'text-white/70' : 'text-muted-foreground'
            }`}>
              <span>{message.timestamp.toLocaleTimeString()}</span>
              <div className="flex items-center gap-2">
                {message.feedback && (
                  <Badge variant={message.feedback.rating === 'good' ? 'default' : 'destructive'} className="text-xs">
                    {message.feedback.rating}
                  </Badge>
                )}
                {!isUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className={`h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isUser ? 'hover:bg-white/20' : 'hover:bg-muted'
                    }`}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Controls */}
            {!isUser && showAdvancedControls && (
              <div className="flex gap-2 pt-3 border-t border-border/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('good')}
                  disabled={!!message.feedback}
                  className="h-8 px-3 text-xs"
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Good
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('bad')}
                  disabled={!!message.feedback}
                  className="h-8 px-3 text-xs"
                >
                  <ThumbsDown className="h-3 w-3 mr-1" />
                  Bad
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="h-8 px-3 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Feedback
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReprompt(!showReprompt)}
                  className="h-8 px-3 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Re-prompt
                </Button>
              </div>
            )}

            {/* Feedback Form */}
            {showFeedback && (
              <div className="space-y-3 pt-3 border-t border-border/20 animate-fade-in">
                <Textarea
                  placeholder="Add annotation or feedback..."
                  value={annotation}
                  onChange={(e) => setAnnotation(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
                <Textarea
                  placeholder="Provide corrected content..."
                  value={correctedContent}
                  onChange={(e) => setCorrectedContent(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleFeedback('good')} className="text-xs">
                    Submit Positive
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleFeedback('bad')} className="text-xs">
                    Submit Negative
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowFeedback(false)} className="text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Re-prompt Form */}
            {showReprompt && (
              <div className="space-y-3 pt-3 border-t border-border/20 animate-fade-in">
                <Textarea
                  value={repromptContent}
                  onChange={(e) => setRepromptContent(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleReprompt} className="text-xs">
                    Re-prompt
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowReprompt(false)} className="text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
