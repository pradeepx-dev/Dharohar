import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/UI/Button';


const Login: React.FC = () => {
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";
  
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  return (
    <div className="min-h-screen pt-24 flex flex-col justify-center items-center p-4 bg-slate-50 dark:bg-[#050505] transition-colors duration-300">
        
      {/* Glow Effect */}
      <div className="absolute w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>

      <div className="max-w-md w-full bg-white dark:bg-[#0F0F0F] backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl relative z-10 overflow-hidden">
        
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                Welcome to Dharohar
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
                Sign in to showcase your projects and connect with developers.
            </p>
          </div>

          <div className="space-y-4">
            {/* Google Button */}
            <Button 
              variant="custom"
              className="w-full h-14 text-base justify-center relative bg-white dark:bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all" 
              onClick={loginWithGoogle}
            >
               <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Continue with Google
            </Button>

          </div>
          
          <p className="mt-8 text-xs text-center text-slate-500 font-medium">
            By signing in, you agree to our <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;