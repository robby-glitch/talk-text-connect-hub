
import { Navigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();
  
  // If authenticated, redirect to calls page
  if (user && !isLoading) {
    return <Navigate to="/calls" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-md w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Talk Connect Hub</h1>
          <p className="text-gray-600 mt-2">
            Make calls and send messages with ease
          </p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default Index;
