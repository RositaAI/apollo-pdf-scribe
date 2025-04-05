
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pen, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TypingAnimation from '@/components/TypingAnimation';
import { useToast } from '@/components/ui/use-toast';

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
      // Store conversation context in sessionStorage to access in chat page
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
    <div className="flex h-screen bg-white">
      {/* Tall sidebar */}
      <div className="w-full max-w-2xl mx-auto h-full flex flex-col items-center justify-center relative bg-gradient-to-b from-[#1A1F2C] to-[#2C3347] shadow-2xl rounded-lg p-8">
        <div className="absolute top-4 right-4 flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <Pen className="h-5 w-5 text-white" />
            <span className="sr-only">Upload PDF</span>
          </Button>
          
          <Button
            disabled={!pdfUploaded || !prompt.trim()}
            className={cn(
              "rounded-full transition-all duration-300",
              !pdfUploaded || !prompt.trim() 
                ? "bg-gray-400 cursor-not-allowed opacity-50" 
                : "bg-blue-500 hover:bg-blue-600"
            )}
            onClick={handleSubmit}
          >
            <Send className="h-5 w-5 text-white" />
            <span className="sr-only">Send</span>
          </Button>
        </div>

        <div className="w-full flex flex-col items-center justify-center space-y-6 text-center">
          <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white mb-4">
            <TypingAnimation 
              text="Hello, I am Apollo." 
              onComplete={() => setTimeout(handleTypingComplete, 500)}
            />
          </div>
          
          {isTypingComplete && (
            <div className="fade-in text-xl text-gray-300 max-w-md">
              Please upload a PDF and let's chat about it.
            </div>
          )}

          {pdfUploaded && (
            <div className="w-full max-w-md fade-in mt-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 mb-4">
                <p className="text-gray-200 text-sm truncate">
                  <span className="font-semibold">Uploaded:</span> {pdfName}
                </p>
              </div>
              <div className="mt-4 relative">
                <textarea
                  className="w-full p-4 pr-12 rounded-lg bg-white/10 text-white placeholder-gray-400 backdrop-blur-lg border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                  placeholder="What would you like to know about this PDF?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={!pdfUploaded}
                />
                <button
                  className={cn(
                    "absolute right-3 bottom-3 p-2 rounded-full transition-all duration-200",
                    prompt.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                  )}
                  disabled={!prompt.trim()}
                  onClick={handleSubmit}
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </div>
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
    </div>
  );
};

export default Index;
