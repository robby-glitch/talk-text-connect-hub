
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from '@/components/layout/MainLayout';
import { supabase } from "@/integrations/supabase/client";

const SettingsPage = () => {
  const { toast } = useToast();
  const { token } = useSession();
  
  // Account settings
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    incomingCalls: true,
    missedCalls: true,
    voicemails: true,
    incomingMessages: true
  });
  
  // Twilio settings
  const [twilioSettings, setTwilioSettings] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: ""
  });

  const [connectionStatus, setConnectionStatus] = useState({
    status: 'unknown',
    message: 'Checking connection...'
  });
  
  // Load user profile data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setAccountForm({
            name: user.user_metadata?.full_name || "",
            email: user.email || "",
            phone: user.phone || ""
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  // Fetch Twilio settings status
  useEffect(() => {
    const checkTwilioConnection = async () => {
      if (!token) return;
      
      try {
        // This would ideally call a specific endpoint to check Twilio status
        // For now, we'll simulate this based on whether we have credentials
        const EDGE_FUNCTION_URL = 'https://mlttglkptuhwmscmlaau.supabase.co/functions/v1';
        const response = await fetch(`${EDGE_FUNCTION_URL}/twilio/calls`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setConnectionStatus({
            status: 'connected',
            message: 'Connected to Twilio successfully'
          });
        } else {
          const errorData = await response.json();
          setConnectionStatus({
            status: 'error',
            message: `Connection error: ${errorData.error || 'Unknown error'}`
          });
        }
      } catch (error) {
        setConnectionStatus({
          status: 'error',
          message: `Connection error: ${error.message}`
        });
      }
    };
    
    checkTwilioConnection();
  }, [token]);
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountForm({
      ...accountForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key]
    });
  };
  
  const handleTwilioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTwilioSettings({
      ...twilioSettings,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSaveAccount = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: accountForm.name }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account settings saved",
        description: "Your account information has been updated",
      });
    } catch (error) {
      toast({
        title: "Error saving account",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleSaveNotifications = () => {
    // In a real application, this would save to a user preferences table in the database
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated",
    });
  };
  
  const handleSaveTwilio = async () => {
    // In a real application with a backend, you would securely save and validate these credentials
    // For the demo, we'll just show a success message
    toast({
      title: "Twilio settings saved",
      description: "Please note: For security reasons, Twilio credentials are stored as environment variables in Supabase and cannot be changed here. This is just a UI demo.",
    });
  };
  
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="twilio">Twilio Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Account Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={accountForm.name}
                  onChange={handleAccountChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={accountForm.email}
                  onChange={handleAccountChange}
                  disabled
                />
                <p className="text-sm text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={accountForm.phone}
                  onChange={handleAccountChange}
                />
              </div>
            </div>
            
            <Separator />
            
            <h2 className="text-xl font-semibold">Change Password</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  name="currentPassword"
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  name="newPassword"
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password"
                />
              </div>
            </div>
            
            <Button onClick={handleSaveAccount}>Save Changes</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Incoming Calls</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications for incoming calls</p>
                </div>
                <Switch 
                  checked={notificationSettings.incomingCalls}
                  onCheckedChange={() => handleNotificationChange('incomingCalls')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Missed Calls</h3>
                  <p className="text-sm text-muted-foreground">Get notified about missed calls</p>
                </div>
                <Switch 
                  checked={notificationSettings.missedCalls}
                  onCheckedChange={() => handleNotificationChange('missedCalls')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Voicemails</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications for new voicemails</p>
                </div>
                <Switch 
                  checked={notificationSettings.voicemails}
                  onCheckedChange={() => handleNotificationChange('voicemails')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Incoming Messages</h3>
                  <p className="text-sm text-muted-foreground">Get notified about new messages</p>
                </div>
                <Switch 
                  checked={notificationSettings.incomingMessages}
                  onCheckedChange={() => handleNotificationChange('incomingMessages')}
                />
              </div>
            </div>
            
            <Button onClick={handleSaveNotifications}>Save Preferences</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="twilio" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Twilio Integration</h2>
            <p className="text-muted-foreground">
              Your Twilio account is already connected. The credentials are stored securely in the Supabase backend.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountSid">Account SID</Label>
                <Input 
                  id="accountSid" 
                  name="accountSid"
                  value={twilioSettings.accountSid}
                  onChange={handleTwilioChange}
                  placeholder="AC***********************"
                  disabled
                />
                <p className="text-sm text-muted-foreground">Stored securely in backend</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="authToken">Auth Token</Label>
                <Input 
                  id="authToken" 
                  name="authToken"
                  type="password"
                  value={twilioSettings.authToken}
                  onChange={handleTwilioChange}
                  placeholder="*************************"
                  disabled
                />
                <p className="text-sm text-muted-foreground">Stored securely in backend</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Twilio Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  name="phoneNumber"
                  value={twilioSettings.phoneNumber}
                  onChange={handleTwilioChange}
                  placeholder="+1**********"
                  disabled
                />
                <p className="text-sm text-muted-foreground">Stored securely in backend</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Connection Status</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus.status === 'connected' ? 'bg-green-500' : 
                  connectionStatus.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span>{
                  connectionStatus.status === 'connected' ? 'Connected' : 
                  connectionStatus.status === 'error' ? 'Error' : 'Checking...'
                }</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {connectionStatus.message}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
