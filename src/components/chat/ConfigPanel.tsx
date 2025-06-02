
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { ChatConfig } from '@/pages/Chat';

interface ConfigPanelProps {
  config: ChatConfig;
  onConfigChange: (config: ChatConfig) => void;
  onClose: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onConfigChange,
  onClose,
}) => {
  const updateConfig = (updates: Partial<ChatConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <Card className="w-80 border-l h-full overflow-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Settings</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="space-y-2">
          <Label>Mode</Label>
          <Select
            value={config.mode}
            onValueChange={(value: 'basic' | 'advanced') => updateConfig({ mode: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Model Selection */}
        <div className="space-y-2">
          <Label>AI Model</Label>
          <Select
            value={config.model}
            onValueChange={(value) => updateConfig({ model: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">GPT-4O Mini</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Temperature Slider */}
        <div className="space-y-2">
          <Label>Temperature: {config.temperature}</Label>
          <Slider
            value={[config.temperature]}
            onValueChange={(value) => updateConfig({ temperature: value[0] })}
            max={2}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <Label>Max Tokens: {config.maxTokens}</Label>
          <Slider
            value={[config.maxTokens]}
            onValueChange={(value) => updateConfig({ maxTokens: value[0] })}
            max={4000}
            min={100}
            step={100}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Feature Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-toggle">Voice Input</Label>
            <Switch
              id="voice-toggle"
              checked={config.enableVoice}
              onCheckedChange={(checked) => updateConfig({ enableVoice: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="annotations-toggle">Enable Annotations</Label>
            <Switch
              id="annotations-toggle"
              checked={config.enableAnnotations}
              onCheckedChange={(checked) => updateConfig({ enableAnnotations: checked })}
            />
          </div>
        </div>

        <Separator />

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onConfigChange({
            mode: 'basic',
            model: 'gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 1000,
            enableVoice: true,
            enableAnnotations: true,
          })}
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
};
