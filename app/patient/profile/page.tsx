'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { MapPin, Phone, User, ChevronLeft, Loader2, Baby, Calendar, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface PatientProfile {
    id: string;
    fullName: string;
    age: string;
    gender: string;
    phoneNumber: string;
    address: string;
    pregnancyStatus: string;
    createdAt: string;
}

function PatientProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientId = searchParams.get('id');
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!patientId) {
                // Try to load from localStorage (session-based patient)
                const saved = localStorage.getItem('currentPatient');
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        if (parsed.id) {
                            const res = await fetch(`/api/profile/patient/${parsed.id}`);
                            if (res.ok) {
                                const data = await res.json();
                                setProfile(data.profile);
                                setLoading(false);
                                return;
                            }
                        }
                        // Fallback to localStorage data
                        setProfile(parsed);
                    } catch { /* ignore */ }
                }
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/profile/patient/${patientId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data.profile);
                }
            } catch (err) {
                console.error('Failed to load patient profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [patientId]);

    if (loading) {
        return (
            <div className="min-h-screen pb-20">
                <Navbar title="Patient Profile" userRole="asha" profileImage="https://picsum.photos/seed/asha/200/200" />
                <div className="flex items-center justify-center pt-32">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
                    <span className="ml-3 text-[#86868B]">Loading patient profile...</span>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen pb-20">
                <Navbar title="Patient Profile" userRole="asha" profileImage="https://picsum.photos/seed/asha/200/200" />
                <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
                    <User className="w-16 h-16 text-[#C7C7CC] mb-4" />
                    <h2 className="text-xl font-semibold text-[#1D1D1F] mb-2">No Patient Found</h2>
                    <p className="text-[#86868B] mb-6">Please register a patient first to view their profile.</p>
                    <button
                        onClick={() => router.push('/asha/register')}
                        className="px-6 py-3 bg-[#0071E3] text-white rounded-full font-medium hover:bg-[#0077ED] transition-colors"
                    >
                        Register Patient
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            <Navbar
                title="Patient Profile"
                userRole="asha"
                profileImage="https://picsum.photos/seed/asha/200/200"
            />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center text-sm font-medium text-[#86868B] hover:text-[#1D1D1F] mb-6 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                </motion.button>

                {/* Avatar & Name */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center mb-10"
                >
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white apple-shadow-lg mb-4 relative">
                        <Image
                            src={`https://picsum.photos/seed/patient${profile.id}/400/400`}
                            alt={profile.fullName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">{profile.fullName}</h2>
                    <p className="text-[#86868B] mt-1">{profile.gender} • {profile.age} years old</p>
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
                            <p className="text-sm font-medium text-[#1D1D1F]">{profile.phoneNumber || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#34C759]/10 flex items-center justify-center mr-4">
                            <MapPin className="w-4 h-4 text-[#34C759]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-[#86868B] mb-0.5">Village / Address</p>
                            <p className="text-sm font-medium text-[#1D1D1F]">{profile.address || 'N/A'}</p>
                        </div>
                    </div>

                    {profile.gender === 'Female' && (
                        <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mr-4">
                                <Baby className="w-4 h-4 text-[#FF3B30]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-[#86868B] mb-0.5">Pregnancy Status</p>
                                <p className="text-sm font-medium text-[#1D1D1F]">{profile.pregnancyStatus || 'Unknown'}</p>
                            </div>
                        </div>
                    )}

                    <div className="p-4 sm:p-5 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#FF9500]/10 flex items-center justify-center mr-4">
                            <Calendar className="w-4 h-4 text-[#FF9500]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-[#86868B] mb-0.5">Registered On</p>
                            <p className="text-sm font-medium text-[#1D1D1F]">
                                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Action Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden"
                >
                    <button
                        onClick={() => router.push('/asha/symptoms')}
                        className="w-full p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center justify-between hover:bg-[#F5F5F7]/50 transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 flex items-center justify-center mr-4">
                                <Heart className="w-4 h-4 text-[#0071E3]" />
                            </div>
                            <span className="text-sm font-medium text-[#1D1D1F]">Run Symptom Analysis</span>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-[#C7C7CC] rotate-180" />
                    </button>
                </motion.div>
            </main>
        </div>
    );
}

export default function PatientProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
            </div>
        }>
            <PatientProfileContent />
        </Suspense>
    );
}
