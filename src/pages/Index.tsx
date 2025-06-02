
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Settings, Mic, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Chat Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Interactive, multimodal chat application with advanced AI capabilities
          </p>
          <Link to="/chat">
            <Button size="lg" className="text-lg px-8 py-4">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Chatting
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multimodal Input</h3>
            <p className="text-gray-600">
              Upload images, videos, documents, and more
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Mic className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Voice Input</h3>
            <p className="text-gray-600">
              Speak naturally with voice recognition
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Settings className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Customizable</h3>
            <p className="text-gray-600">
              Configure settings and preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
