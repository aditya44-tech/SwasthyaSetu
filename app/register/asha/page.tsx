'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Phone, Lock, MapPin, ArrowRight, ChevronLeft, IdCard } from 'lucide-react';
import Link from 'next/link';

export default function RegisterAshaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    ashaId: '',
    password: '',
    area: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, phoneNumber: `+91${formData.phoneNumber}`, role: 'asha' }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Save user session
      localStorage.setItem('loggedInUser', JSON.stringify(data.user));
      router.push('/asha/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#F5F5F7]">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-green-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="glass apple-shadow-lg rounded-[32px] p-8 md:p-10 flex flex-col">
          <button
            onClick={() => router.push('/login')}
            className="self-start flex items-center text-sm text-[#86868B] hover:text-[#1D1D1F] mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Login
          </button>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              ASHA Registration
            </h1>
            <p className="text-[#86868B]">
              Create your account to start serving your community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-5 py-4 bg-[#F5F5F7]/80 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
                  required
                />
              </div>

              <div className="relative flex items-center w-full bg-[#F5F5F7]/80 border border-white/40 rounded-2xl focus-within:ring-2 focus-within:ring-[#0071E3]/30 focus-within:bg-white transition-all">
                <Phone className="absolute left-4 w-5 h-5 text-[#86868B]" />
                <span className="pl-12 pr-2 text-[#1D1D1F] font-medium">+91</span>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setFormData({ ...formData, phoneNumber: val });
                  }}
                  className="w-full py-4 pr-5 bg-transparent focus:outline-none placeholder:text-[#86868B]"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                />
              </div>

              <div className="relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                <input
                  type="text"
                  placeholder="ASHA ID"
                  value={formData.ashaId}
                  onChange={(e) => setFormData({ ...formData, ashaId: e.target.value })}
                  className="w-full pl-12 pr-5 py-4 bg-[#F5F5F7]/80 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
                  required
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                <input
                  type="text"
                  placeholder="Assigned Village/Area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full pl-12 pr-5 py-4 bg-[#F5F5F7]/80 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-5 py-4 bg-[#F5F5F7]/80 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white py-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center group mt-6 shadow-lg shadow-blue-500/20"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#86868B] text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-[#0071E3] font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
