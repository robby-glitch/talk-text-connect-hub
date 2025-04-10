
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mic, MicOff, PhoneOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type CallInterfaceProps = {
  contactName?: string;
  contactNumber?: string;
  incomingCall?: boolean;
  onEndCall?: () => void;
};

const CallInterface = ({ 
  contactName = "Unknown", 
  contactNumber = "", 
  incomingCall = false,
  onEndCall
}: CallInterfaceProps) => {
  const [isCallActive, setIsCallActive] = useState(incomingCall);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    let timer: number;
    
    if (isCallActive) {
      timer = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCallActive]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartCall = () => {
    toast({
      title: "Calling...",
      description: `Connecting to ${contactName}`,
    });
    
    // Simulate call connection
    setTimeout(() => {
      setIsCallActive(true);
      toast({
        title: "Call Connected",
        description: `You are now connected with ${contactName}`,
      });
    }, 2000);
  };
  
  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    
    toast({
      title: "Call Ended",
      description: `Call with ${contactName} has ended`,
    });
    
    if (onEndCall) onEndCall();
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "You can now be heard" : "You have been muted",
    });
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
            {contactName.charAt(0)}
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold">{contactName}</h2>
            {contactNumber && <p className="text-gray-500">{contactNumber}</p>}
            
            {isCallActive && (
              <p className="mt-2 text-primary">{formatTime(callDuration)}</p>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-8">
            {isCallActive && (
              <Button 
                onClick={toggleMute}
                size="icon"
                variant="outline"
                className={`rounded-full p-6 ${isMuted ? 'bg-red-100 text-red-500' : ''}`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </Button>
            )}
            
            {!isCallActive && !incomingCall ? (
              <Button 
                onClick={handleStartCall}
                size="icon"
                className="call-button bg-green-500 hover:bg-green-600 text-white p-6"
              >
                <Phone size={24} />
              </Button>
            ) : (
              <Button 
                onClick={handleEndCall}
                size="icon"
                className="call-button bg-red-500 hover:bg-red-600 text-white p-6"
              >
                <PhoneOff size={24} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallInterface;
