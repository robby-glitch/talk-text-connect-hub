
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  MessageSquare, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  Search,
  Calendar,
  Clock
} from "lucide-react";

type CallRecord = {
  id: string;
  contactName: string;
  contactNumber: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: Date;
  duration?: number; // in seconds
};

type MessageRecord = {
  id: string;
  contactName: string;
  contactNumber: string;
  preview: string;
  timestamp: Date;
  unread: boolean;
};

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data for demonstration
  const callHistory: CallRecord[] = [
    { 
      id: "1", 
      contactName: "John Doe", 
      contactNumber: "+1234567890", 
      type: 'incoming', 
      timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      duration: 182 // 3:02
    },
    { 
      id: "2", 
      contactName: "Jane Smith", 
      contactNumber: "+1987654321", 
      type: 'outgoing', 
      timestamp: new Date(Date.now() - 3 * 3600000), // 3 hours ago
      duration: 45 // 0:45
    },
    { 
      id: "3", 
      contactName: "Bob Johnson", 
      contactNumber: "+1122334455", 
      type: 'missed', 
      timestamp: new Date(Date.now() - 1 * 86400000), // 1 day ago
    },
    { 
      id: "4", 
      contactName: "Alice Williams", 
      contactNumber: "+1567890123", 
      type: 'incoming', 
      timestamp: new Date(Date.now() - 2 * 86400000), // 2 days ago
      duration: 305 // 5:05
    },
    { 
      id: "5", 
      contactName: "John Doe", 
      contactNumber: "+1234567890", 
      type: 'outgoing', 
      timestamp: new Date(Date.now() - 3 * 86400000), // 3 days ago
      duration: 128 // 2:08
    },
  ];
  
  const messageHistory: MessageRecord[] = [
    {
      id: "1",
      contactName: "John Doe",
      contactNumber: "+1234567890",
      preview: "Can you call me later?",
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      unread: false
    },
    {
      id: "2",
      contactName: "Jane Smith",
      contactNumber: "+1987654321",
      preview: "The meeting is at 3 PM",
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      unread: false
    },
    {
      id: "3",
      contactName: "Bob Johnson",
      contactNumber: "+1122334455",
      preview: "Thanks for your help!",
      timestamp: new Date(Date.now() - 1 * 86400000), // 1 day ago
      unread: false
    },
    {
      id: "4",
      contactName: "Alice Williams",
      contactNumber: "+1567890123",
      preview: "Don't forget about the project deadline",
      timestamp: new Date(Date.now() - 1.5 * 86400000), // 1.5 days ago
      unread: false
    }
  ];
  
  const filteredCallHistory = callHistory.filter(record => 
    record.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.contactNumber.includes(searchQuery)
  );
  
  const filteredMessageHistory = messageHistory.filter(record => 
    record.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.contactNumber.includes(searchQuery) ||
    record.preview.toLowerCase().includes(searchQuery.toLowerCase())
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
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">History</h1>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="pl-9"
          />
        </div>
      </div>
      
      <Tabs defaultValue="calls">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="calls">
            <Phone className="mr-2 h-4 w-4" />
            Call History
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calls" className="space-y-4">
          {filteredCallHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No call history matching your search" : "No call history available"}
            </div>
          ) : (
            filteredCallHistory.map(record => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    {record.type === 'incoming' ? (
                      <PhoneIncoming className="h-5 w-5 text-green-500" />
                    ) : record.type === 'outgoing' ? (
                      <PhoneOutgoing className="h-5 w-5 text-blue-500" />
                    ) : (
                      <PhoneMissed className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{record.contactName}</div>
                    <div className="text-sm text-muted-foreground">{record.contactNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatTimestamp(record.timestamp)}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(record.duration)}
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          {filteredMessageHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No message history matching your search" : "No message history available"}
            </div>
          ) : (
            filteredMessageHistory.map(record => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mr-4">
                    {record.contactName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{record.contactName}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {record.preview}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {formatTimestamp(record.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoryPage;
