'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Phone, Lock, Building2, Stethoscope, ArrowRight, ChevronLeft, FileBadge } from 'lucide-react';
import Link from 'next/link';

export default function RegisterDoctorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    licenseNumber: '',
    specialization: '',
    hospital: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Registering Doctor:', formData);
    // Simulate successful registration
    router.push('/doctor/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#F5F5F7]">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />

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
              Doctor Registration
            </h1>
            <p className="text-[#86868B]">
              Join our network of healthcare professionals
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
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
                  required
                />
              </div>

              <div className="relative">
                <FileBadge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                <input 
                  type="text" 
                  placeholder="Medical License Number" 
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
                  required
                />
              </div>

              <div className="relative">
                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                <input 
                  type="text" 
                  placeholder="Specialization" 
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
                  required
                />
              </div>

              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                <input 
                  type="text" 
                  placeholder="Hospital/Clinic Name" 
                  value={formData.hospital}
                  onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all placeholder:text-[#86868B]"
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
