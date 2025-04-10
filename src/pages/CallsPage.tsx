
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PhoneCall, PhoneIncoming, PhoneOutgoing, Phone, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CallInterface from "@/components/calls/CallInterface";
import IncomingCallAlert from "@/components/calls/IncomingCallAlert";
import { useSession } from '@/components/layout/MainLayout';
import { getCalls, makeCall, formatPhoneNumber, extractContactName, TwilioCall } from '@/services/twilioService';

const CallsPage = () => {
  const [activeTab, setActiveTab] = useState("dialpad");
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeCall, setActiveCall] = useState<boolean>(false);
  const [callData, setCallData] = useState<{ name: string; number: string } | null>(null);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCaller, setIncomingCaller] = useState({ name: "", number: "" });
  const [recentCalls, setRecentCalls] = useState<TwilioCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { token } = useSession();
  
  // Load recent calls
  useEffect(() => {
    const loadCalls = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const calls = await getCalls(token);
        setRecentCalls(calls);
      } catch (error) {
        console.error("Error loading calls:", error);
        toast({
          title: "Error loading calls",
          description: "Could not load recent calls. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCalls();
  }, [token, toast]);
  
  // Simulate incoming call
  useEffect(() => {
    // This would be replaced with a real-time implementation with Twilio in a real app
    const timer = setTimeout(() => {
      if (Math.random() > 0.7 && !activeCall && !showIncomingCall) {
        handleIncomingCall();
      }
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [activeCall, showIncomingCall]);
  
  const handleDialpadInput = (value: string) => {
    setPhoneNumber(prev => prev + value);
  };
  
  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };
  
  const handleCall = async () => {
    if (!phoneNumber.trim()) return;
    
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to make calls",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await makeCall(token, phoneNumber);
      
      setCallData({
        name: extractContactName(phoneNumber),
        number: phoneNumber
      });
      
      setActiveCall(true);
      setPhoneNumber("");
    } catch (error) {
      console.error("Error making call:", error);
      toast({
        title: "Call Failed",
        description: "Could not place the call. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCallFromHistory = (call: TwilioCall) => {
    const number = call.direction === 'outbound-api' ? call.to : call.from;
    setCallData({
      name: extractContactName(number),
      number: number
    });
    setActiveCall(true);
  };
  
  const handleIncomingCall = () => {
    // In a real app, this would be triggered by Twilio's webhook
    const randomNumber = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    setIncomingCaller({
      name: extractContactName(randomNumber),
      number: randomNumber
    });
    setShowIncomingCall(true);
  };
  
  const handleAcceptCall = () => {
    setShowIncomingCall(false);
    setCallData(incomingCaller);
    setActiveCall(true);
  };
  
  const handleDeclineCall = () => {
    setShowIncomingCall(false);
    toast({
      title: "Call Declined",
      description: `You declined a call from ${incomingCaller.name}`,
    });
  };
  
  const handleEndCall = () => {
    setActiveCall(false);
    setCallData(null);
    
    // In a real app, you would also notify Twilio to end the call
    toast({
      title: "Call Ended",
      description: callData ? `Call with ${callData.name} has ended` : "Call has ended",
    });
  };
  
  const filteredCalls = recentCalls.filter(call => {
    const searchLower = searchQuery.toLowerCase();
    const fromMatches = call.from.toLowerCase().includes(searchLower);
    const toMatches = call.to.toLowerCase().includes(searchLower);
    const nameMatches = extractContactName(call.from).toLowerCase().includes(searchLower) || 
                       extractContactName(call.to).toLowerCase().includes(searchLower);
    
    return fromMatches || toMatches || nameMatches;
  });
  
  // Dialpad buttons layout
  const dialpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];
  
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Phone</h1>
      
      {activeCall ? (
        <CallInterface 
          contactName={callData?.name}
          contactNumber={callData?.number}
          onEndCall={handleEndCall}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="dialpad">Dialpad</TabsTrigger>
                <TabsTrigger value="recent">Recent Calls</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dialpad" className="space-y-4">
                <div className="relative mb-6">
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg text-center py-6"
                    placeholder="Enter phone number"
                  />
                  {phoneNumber && (
                    <button 
                      onClick={handleBackspace}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      &#x232B;
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {dialpadButtons.flat().map((btn) => (
                    <Button
                      key={btn}
                      variant="outline"
                      className="h-16 text-xl"
                      onClick={() => handleDialpadInput(btn)}
                    >
                      {btn}
                    </Button>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={handleCall}
                    disabled={!phoneNumber}
                    size="icon"
                    className="call-button bg-green-500 hover:bg-green-600 text-white p-6"
                  >
                    <Phone size={24} />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <Input
                      placeholder="Search calls"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  {isLoading ? (
                    <div className="text-center py-6 text-gray-500">Loading recent calls...</div>
                  ) : filteredCalls.length > 0 ? (
                    filteredCalls.map((call) => {
                      const isOutgoing = call.direction === 'outbound-api';
                      const displayNumber = isOutgoing ? call.to : call.from;
                      const callDate = new Date(call.date);
                      
                      return (
                        <div 
                          key={call.id}
                          onClick={() => handleCallFromHistory(call)}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${isOutgoing ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                              {isOutgoing ? <PhoneOutgoing size={18} /> : <PhoneIncoming size={18} />}
                            </div>
                            <div>
                              <div className="font-medium">{extractContactName(displayNumber)}</div>
                              <div className="text-sm text-gray-500">{formatPhoneNumber(displayNumber)}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {callDate.toLocaleDateString()} {callDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      {searchQuery ? "No matching calls found" : "No recent calls"}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      <IncomingCallAlert 
        isOpen={showIncomingCall}
        caller={incomingCaller}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />
    </div>
  );
};

export default CallsPage;
