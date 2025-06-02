
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Message, MessageFeedback } from '@/pages/Chat';
import { User, Bot, ThumbsUp, ThumbsDown, Edit, RotateCcw } from 'lucide-react';
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

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
      </div>

      <Card className={`p-4 max-w-2xl ${isUser ? 'bg-primary text-primary-foreground' : ''}`}>
        <div className="space-y-3">
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="space-y-2">
              {message.attachments.map((attachment) => (
                <AttachmentDisplay key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs opacity-70">
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {message.feedback && (
              <Badge variant={message.feedback.rating === 'good' ? 'default' : 'destructive'}>
                {message.feedback.rating}
              </Badge>
            )}
          </div>

          {!isUser && showAdvancedControls && (
            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback('good')}
                disabled={!!message.feedback}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback('bad')}
                disabled={!!message.feedback}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFeedback(!showFeedback)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReprompt(!showReprompt)}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          )}

          {showFeedback && (
            <div className="space-y-2 pt-2 border-t">
              <Textarea
                placeholder="Add annotation or feedback..."
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                rows={2}
              />
              <Textarea
                placeholder="Provide corrected content..."
                value={correctedContent}
                onChange={(e) => setCorrectedContent(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleFeedback('good')}>
                  Submit Positive
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleFeedback('bad')}>
                  Submit Negative
                </Button>
              </div>
            </div>
          )}

          {showReprompt && (
            <div className="space-y-2 pt-2 border-t">
              <Textarea
                value={repromptContent}
                onChange={(e) => setRepromptContent(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReprompt}>
                  Re-prompt
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowReprompt(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
