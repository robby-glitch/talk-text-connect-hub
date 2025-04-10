
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CallInterface from "@/components/calls/CallInterface";
import IncomingCallAlert from "@/components/calls/IncomingCallAlert";
import { Phone, X } from "lucide-react";

const CallsPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  
  const handleStartCall = () => {
    if (!phoneNumber) return;
    setContactName(contactName || phoneNumber);
    setShowCallInterface(true);
  };
  
  const handleEndCall = () => {
    setShowCallInterface(false);
    setPhoneNumber('');
    setContactName('');
  };
  
  // Simulating an incoming call
  const simulateIncomingCall = () => {
    setShowIncomingCall(true);
  };
  
  const handleAcceptCall = () => {
    setShowIncomingCall(false);
    setContactName("John Doe");
    setPhoneNumber("+1234567890");
    setShowCallInterface(true);
  };
  
  const handleDeclineCall = () => {
    setShowIncomingCall(false);
  };
  
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Phone Calls</h1>
      
      {!showCallInterface ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Make a Call</h2>
              <div className="flex space-x-2">
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="flex-1"
                />
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Contact name (optional)"
                  className="flex-1"
                />
                <Button 
                  onClick={handleStartCall}
                  disabled={!phoneNumber}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </div>
            </div>
            
            <div className="pt-4">
              <h2 className="text-lg font-medium mb-2">Recent Contacts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "John Doe", number: "+1234567890" },
                  { name: "Jane Smith", number: "+1987654321" },
                  { name: "Bob Johnson", number: "+1122334455" },
                  { name: "Alice Williams", number: "+1567890123" }
                ].map((contact) => (
                  <div 
                    key={contact.number}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setPhoneNumber(contact.number);
                      setContactName(contact.name);
                      setShowCallInterface(true);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mr-3">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.number}</div>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Phone size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={simulateIncomingCall}
                className="w-full"
              >
                Simulate Incoming Call (Demo)
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-0 right-0"
            onClick={handleEndCall}
          >
            <X />
          </Button>
          <CallInterface 
            contactName={contactName}
            contactNumber={phoneNumber}
            onEndCall={handleEndCall}
          />
        </div>
      )}
      
      <IncomingCallAlert 
        isOpen={showIncomingCall}
        caller={{
          name: "John Doe",
          number: "+1234567890"
        }}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />
    </div>
  );
};

export default CallsPage;
