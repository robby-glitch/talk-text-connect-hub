
import { supabase } from "@/integrations/supabase/client";

// Base URL for Supabase Edge Functions
const EDGE_FUNCTION_URL = 'https://mlttglkptuhwmscmlaau.supabase.co/functions/v1';

export type TwilioCall = {
  id: string;
  direction: string;
  status: string;
  from: string;
  to: string;
  duration: string;
  date: string;
};

export type TwilioMessage = {
  id: string;
  direction: 'user' | 'contact';
  body: string;
  from: string;
  to: string;
  status: string;
  date: string;
};

export const makeCall = async (token: string, to: string) => {
  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/twilio/calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ to })
    });
    
    if (!response.ok) {
      throw new Error(`Error making call: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
};

export const getCalls = async (token: string): Promise<TwilioCall[]> => {
  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/twilio/calls`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching calls: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.calls || [];
  } catch (error) {
    console.error('Error fetching calls:', error);
    return [];
  }
};

export const sendMessage = async (token: string, to: string, body: string) => {
  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/twilio/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ to, body })
    });
    
    if (!response.ok) {
      throw new Error(`Error sending message: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (token: string): Promise<TwilioMessage[]> => {
  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/twilio/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching messages: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const formatPhoneNumber = (phoneNumber: string) => {
  // Format phone numbers for display
  if (!phoneNumber) return '';
  
  // Remove non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length (US numbers assumed)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else {
    // For international or unusual formats, just add a + if needed
    return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  }
};

export const extractContactName = (phoneNumber: string) => {
  // This would ideally be replaced with a lookup in your contacts database
  // For now, just return a formatted version of the phone number
  return `Contact at ${formatPhoneNumber(phoneNumber)}`;
};
