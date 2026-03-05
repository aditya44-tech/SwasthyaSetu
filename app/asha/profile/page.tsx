'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { MapPin, Phone, Award, ChevronRight, LogOut, Shield } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AshaProfile() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20">
      <Navbar 
        title="Profile" 
        userRole="asha" 
        profileImage="https://picsum.photos/seed/asha/200/200" 
      />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white apple-shadow-lg mb-4 relative">
            <Image 
              src="https://picsum.photos/seed/asha/400/400" 
              alt="Sunita Sharma" 
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Sunita Sharma</h2>
          <p className="text-[#86868B] mt-1">Senior ASHA Worker • ID: AW-8472</p>
          
          <button className="mt-6 px-6 py-2 bg-black/5 hover:bg-black/10 text-[#1D1D1F] font-medium rounded-full transition-colors text-sm">
            Edit Profile
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden mb-6"
        >
          <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 flex items-center justify-center mr-4">
              <Phone className="w-4 h-4 text-[#0071E3]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#86868B] mb-0.5">Phone Number</p>
              <p className="text-sm font-medium text-[#1D1D1F]">+91 98765 43210</p>
            </div>
          </div>
          
          <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#34C759]/10 flex items-center justify-center mr-4">
              <MapPin className="w-4 h-4 text-[#34C759]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#86868B] mb-0.5">Assigned Village</p>
              <p className="text-sm font-medium text-[#1D1D1F]">Rampur Block, District A</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FF9500]/10 flex items-center justify-center mr-4">
              <Award className="w-4 h-4 text-[#FF9500]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#86868B] mb-0.5">Experience</p>
              <p className="text-sm font-medium text-[#1D1D1F]">5 Years Active Service</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden"
        >
          <button className="w-full p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center justify-between hover:bg-[#F5F5F7]/50 transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center mr-4">
                <Shield className="w-4 h-4 text-[#1D1D1F]" />
              </div>
              <span className="text-sm font-medium text-[#1D1D1F]">Privacy & Security</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#FFF2F2] transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mr-4 group-hover:bg-[#FF3B30]/20 transition-colors">
                <LogOut className="w-4 h-4 text-[#FF3B30]" />
              </div>
              <span className="text-sm font-medium text-[#FF3B30]">Sign Out</span>
            </div>
          </button>
        </motion.div>
      </main>
    </div>
  );
}
