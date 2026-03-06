'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HeartPulse, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'asha' | 'doctor'>('asha');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phone}`, password, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Save user session to localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(data.user));

      if (role === 'asha') {
        router.push('/asha/dashboard');
      } else {
        router.push('/doctor/dashboard');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
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
          <div className="w-16 h-16 bg-[#34C759] rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-green-500/20">
            <HeartPulse className="text-white w-8 h-8" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-[#86868B] text-center mb-8">
            Sign in to access your healthcare dashboard
          </p>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="space-y-4">
              <div className="relative flex items-center w-full bg-[#F5F5F7]/80 border border-white/40 rounded-2xl focus-within:ring-2 focus-within:ring-[#0071E3]/30 focus-within:bg-white transition-all duration-300">
                <span className="pl-5 pr-2 text-[#1D1D1F] font-medium">+91</span>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ''); // Allow only digits
                    if (val.length <= 10) setPhone(val);
                  }}
                  className="w-full py-4 pr-5 bg-transparent focus:outline-none placeholder:text-[#86868B]"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-[#F5F5F7]/80 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all duration-300 placeholder:text-[#86868B]"
                required
              />
            </div>

            <div className="flex p-1 bg-black/5 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('asha')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${role === 'asha'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
                  }`}
              >
                ASHA Worker
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${role === 'doctor'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
                  }`}
              >
                Doctor
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0071E3] hover:bg-[#0077ED] disabled:bg-blue-300 text-white py-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center group mt-4"
            >
              <span>{isLoading ? 'Signing in...' : 'Continue'}</span>
              {!isLoading && <ChevronRight className="w-5 h-5 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />}
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
