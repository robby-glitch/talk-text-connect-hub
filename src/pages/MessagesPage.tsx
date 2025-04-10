import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessagesSquare, Send } from "lucide-react";
import MessageInterface, { Message } from "@/components/messages/MessageInterface";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from '@/components/layout/MainLayout';
import { getMessages, sendMessage, formatPhoneNumber, extractContactName, TwilioMessage } from '@/services/twilioService';

const groupMessagesByContact = (messages: TwilioMessage[]) => {
  const groups: Record<string, { contact: string, lastMessage: string, date: Date, messages: Message[] }> = {};
  
  messages.forEach(msg => {
    const isIncoming = msg.direction === 'contact';
    const contactNumber = isIncoming ? msg.from : msg.to;
    
    if (!groups[contactNumber]) {
      groups[contactNumber] = {
        contact: contactNumber,
        lastMessage: msg.body,
        date: new Date(msg.date),
        messages: []
      };
    }
    
    const currentDate = new Date(msg.date);
    if (currentDate > groups[contactNumber].date) {
      groups[contactNumber].lastMessage = msg.body;
      groups[contactNumber].date = currentDate;
    }
    
    groups[contactNumber].messages.push({
      id: msg.id,
      content: msg.body,
      sender: msg.direction,
      timestamp: new Date(msg.date)
    });
  });
  
  return Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime());
};

const MessagesPage = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("conversations");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { token } = useSession();
  
  useEffect(() => {
    const loadMessages = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const messages = await getMessages(token);
        const grouped = groupMessagesByContact(messages);
        setConversations(grouped);
        
        if (selectedContact) {
          const contactMessages = grouped.find(g => g.contact === selectedContact)?.messages || [];
          setCurrentMessages(contactMessages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Error loading messages",
          description: "Could not load messages. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [token, selectedContact, toast]);
  
  const handleSelectContact = (contactNumber: string) => {
    setSelectedContact(contactNumber);
    const contactMessages = conversations.find(c => c.contact === contactNumber)?.messages || [];
    setCurrentMessages(contactMessages);
    setActiveTab("conversations");
  };
  
  const handleSendNewMessage = async () => {
    if (!newContactNumber.trim() || !newMessageText.trim() || !token) return;
    
    try {
      await sendMessage(token, newContactNumber, newMessageText);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: newMessageText,
        sender: 'user',
        timestamp: new Date()
      };
      
      const existingConversationIndex = conversations.findIndex(c => c.contact === newContactNumber);
      
      if (existingConversationIndex >= 0) {
        const updatedConversations = [...conversations];
        updatedConversations[existingConversationIndex].messages.push(newMessage);
        updatedConversations[existingConversationIndex].lastMessage = newMessageText;
        updatedConversations[existingConversationIndex].date = new Date();
        setConversations(updatedConversations);
      } else {
        setConversations([
          {
            contact: newContactNumber,
            lastMessage: newMessageText,
            date: new Date(),
            messages: [newMessage]
          },
          ...conversations
        ]);
      }
      
      setSelectedContact(newContactNumber);
      setCurrentMessages(prev => [...prev, newMessage]);
      setNewMessageText("");
      setNewContactNumber("");
      setActiveTab("conversations");
      
      toast({
        title: "Message Sent",
        description: `Message sent to ${formatPhoneNumber(newContactNumber)}`,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message Failed",
        description: "Could not send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSendMessageToCurrentContact = async (messageText: string) => {
    if (!selectedContact || !messageText.trim() || !token) return;
    
    try {
      await sendMessage(token, selectedContact, messageText);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageText,
        sender: 'user',
        timestamp: new Date()
      };
      
      setCurrentMessages(prev => [...prev, newMessage]);
      
      const updatedConversations = conversations.map(conv => {
        if (conv.contact === selectedContact) {
          return {
            ...conv,
            lastMessage: messageText,
            date: new Date(),
            messages: [...conv.messages, newMessage]
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations.sort((a, b) => b.date.getTime() - a.date.getTime()));
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message Failed",
        description: "Could not send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchQuery.toLowerCase();
    const contactMatches = conv.contact.toLowerCase().includes(searchLower);
    const nameMatches = extractContactName(conv.contact).toLowerCase().includes(searchLower);
    const messageMatches = conv.lastMessage.toLowerCase().includes(searchLower);
    
    return contactMatches || nameMatches || messageMatches;
  });
  
  return (
    <div className="container mx-auto max-w-4xl h-[calc(100vh-120px)]">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        <div className="md:col-span-1 h-full">
          <Card className="h-full flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="conversations">Conversations</TabsTrigger>
                  <TabsTrigger value="new">New Message</TabsTrigger>
                </TabsList>
                
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <Input
                      placeholder="Search messages"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <TabsContent value="conversations" className="flex-1 overflow-auto space-y-1">
                  {isLoading ? (
                    <div className="text-center py-6 text-gray-500">Loading conversations...</div>
                  ) : filteredConversations.length > 0 ? (
                    filteredConversations.map((conv) => (
                      <div 
                        key={conv.contact}
                        onClick={() => handleSelectContact(conv.contact)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${
                          selectedContact === conv.contact ? 'bg-primary/10' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-bold mr-3">
                          {extractContactName(conv.contact).charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{extractContactName(conv.contact)}</div>
                          <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {conv.date.toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500 flex flex-col items-center">
                      <MessagesSquare className="mb-2" size={32} />
                      {searchQuery ? "No matching conversations" : "No conversations yet"}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="new" className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-sm font-medium mb-1">Recipient Number</label>
                      <Input
                        value={newContactNumber}
                        onChange={(e) => setNewContactNumber(e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder="Type your message"
                        className="flex-1 min-h-[150px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSendNewMessage}
                        disabled={!newContactNumber.trim() || !newMessageText.trim()}
                      >
                        <Send className="mr-2" size={16} />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 h-full">
          {selectedContact ? (
            <MessageInterface 
              contactName={extractContactName(selectedContact)}
              contactNumber={formatPhoneNumber(selectedContact)}
              initialMessages={currentMessages}
              onSendMessage={handleSendMessageToCurrentContact}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center p-6">
                <MessagesSquare className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-gray-500 mt-2">
                  Select a conversation from the list or start a new message
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
