
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import MessageInterface, { Message } from "@/components/messages/MessageInterface";
import { MessageSquare, Search } from "lucide-react";

const MessagesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<{
    name: string;
    number: string;
    messages: Message[];
  } | null>(null);
  
  // Sample data for demonstration
  const contacts = [
    {
      name: "John Doe",
      number: "+1234567890",
      lastMessage: "Can you call me later?",
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      unread: 2,
      messages: [
        {
          id: "1",
          content: "Hi there!",
          sender: "contact" as const,
          timestamp: new Date(Date.now() - 30 * 60000)
        },
        {
          id: "2",
          content: "Hello! How are you?",
          sender: "user" as const,
          timestamp: new Date(Date.now() - 25 * 60000)
        },
        {
          id: "3",
          content: "I'm good, thanks! Can you call me later?",
          sender: "contact" as const,
          timestamp: new Date(Date.now() - 15 * 60000)
        }
      ]
    },
    {
      name: "Jane Smith",
      number: "+1987654321",
      lastMessage: "The meeting is at 3 PM",
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      unread: 0,
      messages: [
        {
          id: "1",
          content: "Don't forget about our meeting",
          sender: "contact" as const,
          timestamp: new Date(Date.now() - 3 * 3600000)
        },
        {
          id: "2",
          content: "What time was it again?",
          sender: "user" as const,
          timestamp: new Date(Date.now() - 2.5 * 3600000)
        },
        {
          id: "3",
          content: "The meeting is at 3 PM",
          sender: "contact" as const,
          timestamp: new Date(Date.now() - 2 * 3600000)
        }
      ]
    },
    {
      name: "Bob Johnson",
      number: "+1122334455",
      lastMessage: "Thanks for your help!",
      timestamp: new Date(Date.now() - 1 * 86400000), // 1 day ago
      unread: 0,
      messages: [
        {
          id: "1",
          content: "I need some help with the project",
          sender: "contact" as const,
          timestamp: new Date(Date.now() - 1.5 * 86400000)
        },
        {
          id: "2",
          content: "Sure, what do you need?",
          sender: "user" as const,
          timestamp: new Date(Date.now() - 1.2 * 86400000)
        },
        {
          id: "3",
          content: "Thanks for your help!",
          sender: "contact" as const,
          timestamp: new Date(Date.now() - 1 * 86400000)
        }
      ]
    }
  ];
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.number.includes(searchQuery)
  );
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (diff < oneDay && now.getDate() === date.getDate()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 7 * oneDay) {
      const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
      return date.toLocaleDateString(undefined, options);
    } else {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  };
  
  return (
    <div className="container mx-auto max-w-6xl h-[calc(100vh-6rem)]">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="flex h-[calc(100%-3rem)] border rounded-lg overflow-hidden bg-white">
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No messages found
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.number}
                  className={`p-3 border-b cursor-pointer hover:bg-muted/50 flex ${
                    selectedContact?.number === contact.number ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex-shrink-0 flex items-center justify-center text-white font-bold mr-3">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <div className="font-medium truncate">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(contact.timestamp)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground truncate">
                        {contact.lastMessage}
                      </div>
                      {contact.unread > 0 && (
                        <div className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t">
            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          {selectedContact ? (
            <MessageInterface
              contactName={selectedContact.name}
              contactNumber={selectedContact.number}
              initialMessages={selectedContact.messages}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <Card className="w-2/3 max-w-md">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h2 className="text-xl font-medium mt-4">No conversation selected</h2>
                  <p className="text-muted-foreground mt-2">
                    Choose a conversation from the list or start a new one
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
