
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  
  // Account settings
  const [accountForm, setAccountForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890"
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    incomingCalls: true,
    missedCalls: true,
    voicemails: true,
    incomingMessages: true
  });
  
  // Twilio settings (placeholder for API integration)
  const [twilioSettings, setTwilioSettings] = useState({
    accountSid: "AC************************",
    authToken: "***************************",
    phoneNumber: "+1234567890"
  });
  
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
  
  const handleSaveAccount = () => {
    toast({
      title: "Account settings saved",
      description: "Your account information has been updated",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated",
    });
  };
  
  const handleSaveTwilio = () => {
    toast({
      title: "Twilio settings saved",
      description: "Your Twilio configuration has been updated",
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
                />
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
              Connect your Twilio account to enable phone calls and messaging functionality.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountSid">Account SID</Label>
                <Input 
                  id="accountSid" 
                  name="accountSid"
                  value={twilioSettings.accountSid}
                  onChange={handleTwilioChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authToken">Auth Token</Label>
                <Input 
                  id="authToken" 
                  name="authToken"
                  type="password"
                  value={twilioSettings.authToken}
                  onChange={handleTwilioChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Twilio Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  name="phoneNumber"
                  value={twilioSettings.phoneNumber}
                  onChange={handleTwilioChange}
                />
              </div>
            </div>
            
            <Button onClick={handleSaveTwilio}>Save Twilio Settings</Button>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Connection Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Connected (Demo Mode)</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Note: This is a demonstration. In a real application, you would need to securely
                store your Twilio credentials and verify the connection.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
