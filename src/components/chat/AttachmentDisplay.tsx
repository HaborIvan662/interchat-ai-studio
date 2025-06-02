
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Attachment } from '@/pages/Chat';
import { FileText, Image, Video, Music, Database } from 'lucide-react';

interface AttachmentDisplayProps {
  attachment: Attachment;
}

export const AttachmentDisplay: React.FC<AttachmentDisplayProps> = ({ attachment }) => {
  const getIcon = () => {
    switch (attachment.type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'data':
        return <Database className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <Card className="p-3 bg-muted/50">
      <div className="flex items-center gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {attachment.type}
            </Badge>
            {attachment.size && (
              <span className="text-xs text-muted-foreground">
                {formatSize(attachment.size)}
              </span>
            )}
          </div>
        </div>
        
        {attachment.type === 'image' && (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="w-12 h-12 object-cover rounded"
          />
        )}
      </div>
    </Card>
  );
};
