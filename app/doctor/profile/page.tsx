'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { MapPin, Phone, Stethoscope, ChevronRight, LogOut, Shield, Loader2, Briefcase, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface DoctorProfile {
    id: string;
    name: string;
    role: string;
    contact: string;
    location: string;
    createdAt: string;
}

export default function DoctorProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [caseCount, setCaseCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First, try to load from session
                const saved = localStorage.getItem('loggedInUser');
                let profileLoaded = false;
                if (saved) {
                    try {
                        const user = JSON.parse(saved);
                        if (user.role === 'doctor') {
                            setProfile(user);
                            profileLoaded = true;
                        }
                    } catch { /* ignore */ }
                }

                // Fallback to API if no session
                if (!profileLoaded) {
                    const profileRes = await fetch('/api/profile/doctor');
                    if (profileRes.ok) {
                        const data = await profileRes.json();
                        setProfile(data.profile);
                    }
                }

                // Always fetch live case count
                const casesRes = await fetch('/api/cases');
                if (casesRes.ok) {
                    const casesData = await casesRes.json();
                    setCaseCount((casesData.cases || []).length);
                }
            } catch (err) {
                console.error('Failed to load doctor profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pb-20">
                <Navbar title="Doctor Profile" userRole="doctor" profileImage="https://picsum.photos/seed/doctor/200/200" />
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
                title="Doctor Profile"
                userRole="doctor"
                profileImage="https://picsum.photos/seed/doctor/200/200"
            />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Avatar & Name */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center mb-10"
                >
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white apple-shadow-lg mb-4 relative">
                        <Image
                            src="https://picsum.photos/seed/doctor/400/400"
                            alt={profile?.name || 'Doctor'}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">{profile?.name || 'Doctor'}</h2>
                    <p className="text-[#86868B] mt-1">Medical Officer • ID: {profile?.id?.slice(-6).toUpperCase()}</p>

                    <button className="mt-6 px-6 py-2 bg-black/5 hover:bg-black/10 text-[#1D1D1F] font-medium rounded-full transition-colors text-sm">
                        Edit Profile
                    </button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="grid grid-cols-2 gap-4 mb-6"
                >
                    <div className="bg-gradient-to-br from-[#EAF4FF] to-white rounded-[20px] p-5 apple-shadow border border-[#0071E3]/10">
                        <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 flex items-center justify-center mb-3">
                            <Users className="w-5 h-5 text-[#0071E3]" />
                        </div>
                        <p className="text-2xl font-bold text-[#1D1D1F]">{caseCount}</p>
                        <p className="text-xs text-[#86868B] mt-0.5">Active Cases</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#F2FDF4] to-white rounded-[20px] p-5 apple-shadow border border-[#34C759]/10">
                        <div className="w-10 h-10 rounded-full bg-[#34C759]/10 flex items-center justify-center mb-3">
                            <Stethoscope className="w-5 h-5 text-[#34C759]" />
                        </div>
                        <p className="text-2xl font-bold text-[#1D1D1F]">Online</p>
                        <p className="text-xs text-[#86868B] mt-0.5">Availability</p>
                    </div>
                </motion.div>

                {/* Details Card */}
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
                            <p className="text-xs text-[#86868B] mb-0.5">Hospital / Location</p>
                            <p className="text-sm font-medium text-[#1D1D1F]">{profile?.location || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#FF9500]/10 flex items-center justify-center mr-4">
                            <Briefcase className="w-4 h-4 text-[#FF9500]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-[#86868B] mb-0.5">Member Since</p>
                            <p className="text-sm font-medium text-[#1D1D1F]">
                                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Actions Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden"
                >
                    <button
                        onClick={() => router.push('/doctor/dashboard')}
                        className="w-full p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center justify-between hover:bg-[#F5F5F7]/50 transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 flex items-center justify-center mr-4">
                                <Stethoscope className="w-4 h-4 text-[#0071E3]" />
                            </div>
                            <span className="text-sm font-medium text-[#1D1D1F]">Go to Dashboard</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
                    </button>

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
