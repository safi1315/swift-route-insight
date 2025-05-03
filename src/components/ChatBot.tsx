
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ open, onOpenChange }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: 'Hello! I\'m your Fleet Assistant. How can I help you with your fleet management today?', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I can help you analyze driver behavior patterns across your fleet.",
        "Would you like me to show you vehicles that need maintenance soon?",
        "I can provide insights on fuel consumption trends by region.",
        "Let me check the latest safety metrics for your fleet.",
        "I can help you identify routes with traffic congestion right now."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        role: 'bot',
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fleet Assistant</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[60vh] max-h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your fleet..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBot;
