
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">AI is thinking...</span>
      </div>
    </div>
  );
};
