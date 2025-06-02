
import React from 'react';
import { Bot } from 'lucide-react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md">
          <Bot className="h-5 w-5" />
        </div>
      </div>

      {/* Loading Content */}
      <div className="flex-1 max-w-3xl">
        <div className="bg-card border-2 border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Animated Dots */}
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            
            {/* Loading Text */}
            <span className="text-sm text-muted-foreground font-medium">
              AI is thinking...
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-muted rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
