import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: Date;
};

type MessageInterfaceProps = {
  contactName: string;
  contactNumber: string;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
};

const MessageInterface = ({ 
  contactName, 
  contactNumber,
  initialMessages = [],
  onSendMessage
}: MessageInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (onSendMessage) {
      onSendMessage(newMessage);
      setNewMessage('');
      return;
    }
    
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated reply to: "${newMessage}"`,
        sender: 'contact',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, reply]);
      
      toast({
        title: "New Message",
        description: `${contactName} has sent you a message`,
      });
    }, 1500);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-bold mr-2">
            {contactName.charAt(0)}
          </div>
          <div>
            <div>{contactName}</div>
            <div className="text-sm text-muted-foreground">{contactNumber}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 flex flex-col space-y-2">
        <div className="flex-1 overflow-auto p-1">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-center p-4">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message-bubble ${
                  message.sender === 'user' ? 'sent' : 'received'
                }`}
              >
                <div>{message.content}</div>
                <div className={`text-xs ${
                  message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                } text-right mt-1`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <form 
          className="flex space-x-2" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default MessageInterface;
