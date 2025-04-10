
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Phone, PhoneOff } from "lucide-react";

type IncomingCallAlertProps = {
  isOpen: boolean;
  caller: {
    name: string;
    number: string;
  };
  onAccept: () => void;
  onDecline: () => void;
};

const IncomingCallAlert = ({
  isOpen,
  caller,
  onAccept,
  onDecline,
}: IncomingCallAlertProps) => {
  const [ringtoneAudio, setRingtoneAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for ringtone (in a real app, you'd have an actual audio file)
    const audio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
    audio.loop = true;
    setRingtoneAudio(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (ringtoneAudio) {
      if (isOpen) {
        ringtoneAudio.play().catch(e => console.log("Audio play failed:", e));
      } else {
        ringtoneAudio.pause();
        ringtoneAudio.currentTime = 0;
      }
    }
  }, [isOpen, ringtoneAudio]);

  const handleAccept = () => {
    if (ringtoneAudio) {
      ringtoneAudio.pause();
      ringtoneAudio.currentTime = 0;
    }
    onAccept();
  };

  const handleDecline = () => {
    if (ringtoneAudio) {
      ringtoneAudio.pause();
      ringtoneAudio.currentTime = 0;
    }
    onDecline();
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl">
            Incoming Call
          </AlertDialogTitle>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xl font-bold mb-3">
              {caller.name.charAt(0)}
            </div>
            <AlertDialogDescription className="text-center text-lg font-medium">
              {caller.name}
            </AlertDialogDescription>
            <AlertDialogDescription className="text-center">
              {caller.number}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center space-x-4">
          <AlertDialogCancel 
            onClick={handleDecline}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full h-14 w-14 flex items-center justify-center"
          >
            <PhoneOff />
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full h-14 w-14 flex items-center justify-center"
          >
            <Phone />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default IncomingCallAlert;
