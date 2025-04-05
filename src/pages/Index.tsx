
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TypingAnimation from '@/components/TypingAnimation';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { GlowFilters, GlowText } from '@/components/GlowEffects';

const Index = () => {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfUploaded(true);
      setPdfName(file.name);
      toast({
        title: "PDF Uploaded",
        description: `${file.name} has been successfully uploaded.`,
        duration: 3000,
      });
    } else if (file) {
      toast({
        title: "Invalid File Format",
        description: "Please upload a PDF file.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSubmit = () => {
    if (pdfUploaded && prompt.trim() !== '') {
      sessionStorage.setItem('pdfName', pdfName);
      sessionStorage.setItem('initialPrompt', prompt);
      navigate('/chat');
    } else if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a message to continue.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleTypingComplete = () => {
    setIsTypingComplete(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 p-4">
      {/* SVG Filters for glow effects */}
      <GlowFilters />
      
      <div className="w-full max-w-4xl mx-auto relative animate-fade-in backdrop-blur-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <TypingAnimation 
              text="Hello, I am Apollo." 
              typingSpeed={70}
              onComplete={() => setTimeout(handleTypingComplete, 500)}
              hasGlow={true}
            />
          </h1>
          
          {isTypingComplete && (
            <p className="text-xl text-gray-600 max-w-xl mx-auto mt-4 animate-fade-in">
              Please upload a PDF and let's chat about it.
            </p>
          )}
        </div>

        <div className="rainbow-glow w-full">
          <div className="card w-full">
            <div className="content w-full bg-white rounded-xl shadow-lg p-6 transition-all duration-300 backdrop-blur-lg">
              {pdfUploaded && (
                <div className="bg-blue-50 rounded-lg p-3 mb-6 animate-fade-in flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <p className="text-gray-700 text-sm truncate">
                    <span className="font-semibold">Uploaded:</span> {pdfName}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Input
                    className={cn(
                      "w-full py-6 px-4 pr-12 rounded-lg border-2 transition-all duration-300",
                      pdfUploaded 
                        ? "border-blue-200 focus:border-blue-400 bg-white glass-input" 
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                    )}
                    placeholder={pdfUploaded ? "What would you like to know about this PDF?" : "Upload a PDF to continue..."}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={!pdfUploaded}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="h-5 w-5 text-gray-700" />
                  <span className="sr-only">Upload PDF</span>
                </Button>
                
                <Button
                  size="icon"
                  disabled={!pdfUploaded || !prompt.trim()}
                  className={cn(
                    "h-12 w-12 rounded-full transition-all duration-300",
                    !pdfUploaded || !prompt.trim() 
                      ? "bg-gray-300 cursor-not-allowed" 
                      : "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg"
                  )}
                  onClick={handleSubmit}
                >
                  <Send className="h-5 w-5 text-white" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isTypingComplete && (
          <div className="mt-8 text-center text-gray-500 text-sm animate-fade-in">
            <p>Upload your PDF using the document icon, then ask a question.</p>
          </div>
        )}

        <input
          type="file"
          accept=".pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default Index;
