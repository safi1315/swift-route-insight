
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <Button
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      onClick={onClick}
      size="icon"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};

export default ChatButton;
