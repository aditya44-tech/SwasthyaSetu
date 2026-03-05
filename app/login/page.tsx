'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HeartPulse, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'asha' | 'doctor'>('asha');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'asha') {
      router.push('/asha/dashboard');
    } else {
      router.push('/doctor/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-green-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass apple-shadow-lg rounded-[32px] p-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#0071E3] rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
            <HeartPulse className="text-white w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-semibold tracking-tight mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-[#86868B] text-center mb-8">
            Sign in to access your healthcare dashboard
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Phone Number or ID" 
                className="w-full px-5 py-4 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all duration-300 placeholder:text-[#86868B]"
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full px-5 py-4 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all duration-300 placeholder:text-[#86868B]"
                required
              />
            </div>

            <div className="flex p-1 bg-black/5 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('asha')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  role === 'asha' 
                    ? 'bg-white text-[#1D1D1F] shadow-sm' 
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                ASHA Worker
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  role === 'doctor' 
                    ? 'bg-white text-[#1D1D1F] shadow-sm' 
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                Doctor
              </button>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white py-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center group mt-4"
            >
              <span>Continue</span>
              <ChevronRight className="w-5 h-5 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <a href="#" className="text-sm text-[#0071E3] hover:underline block">Forgot password?</a>
            
            <div className="pt-4 border-t border-gray-200/50">
              <p className="text-[#86868B] text-sm mb-3">Don&apos;t have an account?</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.push('/register/asha')}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-white/60 text-sm font-medium text-[#1D1D1F] hover:bg-white hover:shadow-sm transition-all"
                >
                  Register as ASHA
                </button>
                <button
                  onClick={() => router.push('/register/doctor')}
                  className="px-4 py-2 rounded-xl bg-white/50 border border-white/60 text-sm font-medium text-[#1D1D1F] hover:bg-white hover:shadow-sm transition-all"
                >
                  Register as Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
