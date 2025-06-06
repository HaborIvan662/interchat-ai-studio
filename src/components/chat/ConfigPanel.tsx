
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { X, Eye, EyeOff } from 'lucide-react';
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
  const [showApiKey, setShowApiKey] = useState(false);

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
        {/* OpenAI API Key */}
        <div className="space-y-2">
          <Label>OpenAI API Key</Label>
          <div className="relative">
            <Input
              type={showApiKey ? "text" : "password"}
              placeholder="sk-..."
              value={config.openaiApiKey}
              onChange={(e) => updateConfig({ openaiApiKey: e.target.value })}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your API key is stored locally and never sent to our servers
          </p>
        </div>

        <Separator />

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
              <SelectItem value="gpt-4o">GPT-4O</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
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
            openaiApiKey: '',
          })}
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
};
