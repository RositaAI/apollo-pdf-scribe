import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { GlowFilters } from '@/components/GlowEffects';
import TypingAnimation from '@/components/TypingAnimation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedPdfName = sessionStorage.getItem('pdfName');
    const initialPrompt = sessionStorage.getItem('initialPrompt');
    
    if (!storedPdfName || !initialPrompt) {
      toast({
        title: "Session Expired",
        description: "Please upload a PDF and try again.",
        variant: "destructive",
        duration: 3000,
      });
      navigate('/');
      return;
    }
    
    setPdfName(storedPdfName);
    
    const initialMessage: Message = {
      id: Date.now().toString(),
      text: initialPrompt,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
    
    handleAIResponse(initialPrompt);
  }, [navigate, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAIResponse = (userMessage: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let aiResponse = '';
      
      if (userMessage.toLowerCase().includes('summary')) {
        aiResponse = `Here's a summary of the main points in ${pdfName}:\n\n1. The document discusses key concepts related to the topic.\n2. Several methodologies are presented with comparative analysis.\n3. The conclusion offers recommendations for future research.`;
      } else if (userMessage.toLowerCase().includes('conclusion')) {
        aiResponse = `The conclusion of ${pdfName} emphasizes the importance of the findings and suggests three areas for further investigation: expanded data collection, cross-disciplinary approaches, and practical applications in real-world scenarios.`;
      } else if (userMessage.toLowerCase().includes('author')) {
        aiResponse = `The author of ${pdfName} appears to be Dr. Jane Smith, based on the citations and references throughout the document. Dr. Smith is known for her work in this field with over 20 publications.`;
      } else {
        aiResponse = `I've analyzed ${pdfName} and found information related to your question. The document contains detailed sections on this topic across pages 12-15, with specific references to supporting research by Apollo's research team. Would you like me to elaborate on any particular aspect?`;
      }
      
      const newAiMessageId = Date.now().toString();
      
      setMessages(prev => [...prev, {
        id: newAiMessageId,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        isTyping: true
      }]);
      
      setTypingMessageId(newAiMessageId);
      setIsLoading(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    handleAIResponse(newMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTypingComplete = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isTyping: false } 
          : msg
      )
    );
    setTypingMessageId(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <GlowFilters />
      
      <header className="flex items-center px-4 py-3 bg-white shadow-sm z-10">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">
            <span className="apollo-text">Apollo</span>
          </h1>
          <p className="text-sm text-gray-500 truncate">PDF: {pdfName}</p>
        </div>
      </header>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "fade-in flex flex-col",
                message.sender === 'user' ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={cn(
                  "message-bubble",
                  message.sender === 'user' 
                    ? 'user-message' 
                    : message.isTyping 
                      ? 'ai-message is-typing' 
                      : 'ai-message'
                )}
              >
                {message.isTyping ? (
                  <TypingAnimation 
                    text={message.text}
                    typingSpeed={30}
                    hasGlow={true}
                    onComplete={() => handleTypingComplete(message.id)}
                    containerMaxWidth="100%"
                  />
                ) : (
                  <div className="whitespace-pre-wrap">
                    {message.text.split(/(Apollo)/gi).map((part, index) => {
                      if (part.toLowerCase() === "apollo") {
                        return <span key={index} className="apollo-text">{part}</span>;
                      }
                      return part;
                    })}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {formatTime(message.timestamp)}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="fade-in flex flex-col items-start">
              <div className="message-bubble ai-message typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto relative rainbow-glow-light">
          <textarea
            className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-16 glass-input"
            placeholder="Ask me about the PDF..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className={cn(
              "absolute right-3 bottom-3 p-2 rounded-full transition-all duration-200",
              newMessage.trim() && !isLoading 
                ? "bg-blue-500 hover:bg-blue-600 glow-button" 
                : "bg-gray-400 cursor-not-allowed"
            )}
            disabled={!newMessage.trim() || isLoading}
            onClick={handleSendMessage}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            ) : (
              <Send className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
