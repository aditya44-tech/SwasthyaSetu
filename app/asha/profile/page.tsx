'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { MapPin, Phone, Award, ChevronRight, LogOut, Shield, Loader2 } from 'lucide-react';
import DefaultAvatar from '@/components/DefaultAvatar';
import { useRouter } from 'next/navigation';

interface AshaProfile {
  id: string;
  name: string;
  role: string;
  contact: string;
  location: string;
  createdAt: string;
}

export default function AshaProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AshaProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // First, try to load from session
      const saved = localStorage.getItem('loggedInUser');
      if (saved) {
        try {
          const user = JSON.parse(saved);
          if (user.role === 'asha') {
            setProfile(user);
            setLoading(false);
            return;
          }
        } catch { /* ignore */ }
      }
      // Fallback to API
      try {
        const res = await fetch('/api/profile/asha');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (err) {
        console.error('Failed to load ASHA profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <Navbar title="Profile" userRole="asha" />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
          <span className="ml-3 text-[#86868B]">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar
        title="Profile"
        userRole="asha"

      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="mb-4">
            <DefaultAvatar name={profile?.name || 'ASHA Worker'} size={128} className="border-4 border-white apple-shadow-lg" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{profile?.name || 'ASHA Worker'}</h2>
          <p className="text-[#86868B] mt-1">Senior ASHA Worker • ID: {profile?.id?.slice(-6).toUpperCase()}</p>

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
              <p className="text-sm font-medium text-[#1D1D1F]">{profile?.contact || 'N/A'}</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#34C759]/10 flex items-center justify-center mr-4">
              <MapPin className="w-4 h-4 text-[#34C759]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#86868B] mb-0.5">Assigned Location</p>
              <p className="text-sm font-medium text-[#1D1D1F]">{profile?.location || 'N/A'}</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FF9500]/10 flex items-center justify-center mr-4">
              <Award className="w-4 h-4 text-[#FF9500]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#86868B] mb-0.5">Member Since</p>
              <p className="text-sm font-medium text-[#1D1D1F]">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
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
