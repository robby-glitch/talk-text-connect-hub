
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.name);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? "Login" : "Sign Up"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin 
            ? "Enter your credentials to access your account" 
            : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name"
                placeholder="John Doe" 
                required={!isLogin}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="john@example.com" 
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              name="password" 
              type="password" 
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button
          variant="link"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
