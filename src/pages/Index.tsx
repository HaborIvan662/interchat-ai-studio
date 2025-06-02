
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Mic, Image, Settings, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Chat Studio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of AI interaction with our multimodal chat application. 
            Send text, images, voice, and files while getting intelligent responses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Multimodal Input
              </CardTitle>
              <CardDescription>
                Send text, voice messages, images, videos, and data files
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Integration
              </CardTitle>
              <CardDescription>
                Speak naturally and receive audio responses from the AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Visual Understanding
              </CardTitle>
              <CardDescription>
                Upload images and videos for AI analysis and discussion
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Customizable
              </CardTitle>
              <CardDescription>
                Configure AI behavior, models, and interaction preferences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaborative
              </CardTitle>
              <CardDescription>
                Provide feedback, corrections, and annotations to improve responses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Advanced Features
              </CardTitle>
              <CardDescription>
                Basic and advanced modes with professional tools and controls
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/chat">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Chatting
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
