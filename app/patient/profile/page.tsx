'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { MapPin, Phone, User, ChevronLeft, Loader2, Calendar, Heart, Activity, AlertTriangle, Shield, Stethoscope, FileText, Clock, ChevronDown, ChevronUp, Video } from 'lucide-react';
import DefaultAvatar from '@/components/DefaultAvatar';
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

interface HealthData {
    caseId: string;
    symptoms: string;
    triageLevel: 'Low' | 'Medium' | 'High' | 'Critical' | null;
    analysis: string | null;
    recommendedActions: string[];
    possibleConditions: string[];
    riskFactors: string[];
    status: string;
    escalatedAt: string;
}

interface HistoryItem {
    id: string;
    symptoms: string;
    triageLevel: string;
    analysis: string;
    recommendedActions: string[];
    possibleConditions: string[];
    resolvedAt: string;
    escalatedAt: string;
}

function PatientProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientId = searchParams.get('id');
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
    const [ashaName, setAshaName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [activeCall, setActiveCall] = useState<{ roomName: string } | null>(null);

    const handleStatusChange = async (newStatus: string) => {
        if (!healthData?.caseId || updatingStatus) return;
        setUpdatingStatus(true);
        try {
            const res = await fetch('/api/cases/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caseId: healthData.caseId, status: newStatus }),
            });
            if (res.ok) {
                if (newStatus === 'resolved') {
                    // Case was archived and deleted — clear active health data
                    setHealthData(null);
                    // Refresh history to show the newly archived report
                    if (profile?.fullName) {
                        const histRes = await fetch(`/api/history/${encodeURIComponent(profile.fullName)}`);
                        if (histRes.ok) {
                            const histData = await histRes.json();
                            setHistory(histData.history || []);
                        }
                    }
                } else {
                    setHealthData({ ...healthData, status: newStatus });
                }
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                let pid = patientId;

                if (!pid) {
                    const saved = localStorage.getItem('currentPatient');
                    if (saved) {
                        try {
                            const parsed = JSON.parse(saved);
                            pid = parsed.id;
                        } catch { /* ignore */ }
                    }
                }

                if (!pid) {
                    setLoading(false);
                    return;
                }

                // Fetch patient profile
                const profileRes = await fetch(`/api/profile/patient/${pid}`);
                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setProfile(data.profile);
                }

                // Fetch health data (escalated cases)
                const healthRes = await fetch(`/api/profile/patient/${pid}/health`);
                if (healthRes.ok) {
                    const hData = await healthRes.json();
                    setHealthData(hData.healthData);
                }

                // Fetch patient name first, then history
                // (profile is set above, but we need the name for history)
                let patientName = '';
                const profileCheck = await fetch(`/api/profile/patient/${pid}`);
                if (profileCheck.ok) {
                    const pData = await profileCheck.json();
                    patientName = pData.profile?.fullName || '';
                }
                if (patientName) {
                    const histRes = await fetch(`/api/history/${encodeURIComponent(patientName)}`);
                    if (histRes.ok) {
                        const histData = await histRes.json();
                        setHistory(histData.history || []);
                    }
                }

                // Fetch ASHA worker name
                const saved = localStorage.getItem('loggedInUser');
                if (saved) {
                    try {
                        const user = JSON.parse(saved);
                        if (user.role === 'asha') setAshaName(user.name);
                    } catch { /* ignore */ }
                }
                if (!ashaName) {
                    const ashaRes = await fetch('/api/profile/asha');
                    if (ashaRes.ok) {
                        const ashaData = await ashaRes.json();
                        setAshaName(ashaData.profile?.name || 'ASHA Worker');
                    }
                }

                // Check for active video call
                if (patientName) {
                    const callRes = await fetch(`/api/consultations?patientName=${encodeURIComponent(patientName)}&status=active`);
                    if (callRes.ok) {
                        const callData = await callRes.json();
                        if (callData.consultations?.length > 0) {
                            setActiveCall({ roomName: callData.consultations[0].roomName });
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load patient data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId]);

    const getStatusInfo = () => {
        if (!healthData) return { label: 'No Records', emoji: '⚪', color: 'text-[#86868B]', bg: 'bg-black/5' };
        const level = healthData.triageLevel;
        const status = healthData.status;

        if (status === 'resolved') return { label: 'Recovered', emoji: '🟢', color: 'text-[#34C759]', bg: 'bg-[#34C759]/10' };
        if (level === 'High' || level === 'Critical') return { label: 'Needs Doctor', emoji: '🔴', color: 'text-[#FF3B30]', bg: 'bg-[#FF3B30]/10' };
        return { label: 'Under Monitoring', emoji: '🟡', color: 'text-[#FF9500]', bg: 'bg-[#FF9500]/10' };
    };

    const getRiskBadge = (level: string | null) => {
        switch (level) {
            case 'Critical': return { text: 'Critical Risk', bg: 'bg-[#FF3B30]/10', color: 'text-[#FF3B30]' };
            case 'High': return { text: 'High Risk', bg: 'bg-[#FF3B30]/10', color: 'text-[#FF3B30]' };
            case 'Medium': return { text: 'Medium Risk', bg: 'bg-[#FF9500]/10', color: 'text-[#FF9500]' };
            case 'Low': return { text: 'Low Risk', bg: 'bg-[#34C759]/10', color: 'text-[#34C759]' };
            default: return { text: 'Not Assessed', bg: 'bg-black/5', color: 'text-[#86868B]' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pb-20">
                <Navbar title="Patient Profile" userRole="asha" />
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
                <Navbar title="Patient Profile" userRole="asha" />
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

    const statusInfo = getStatusInfo();
    const riskBadge = getRiskBadge(healthData?.triageLevel || null);

    return (
        <div className="min-h-screen pb-20">
            <Navbar
                title="Patient Profile"
                userRole="asha"

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

                {/* Avatar & Name + Status Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="relative mb-4">
                        <DefaultAvatar name={profile.fullName} size={112} className="border-4 border-white apple-shadow-lg" />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">{profile.fullName}</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.emoji} {statusInfo.label}
                        </span>
                    </div>
                </motion.div>

                {/* ── Join Video Call Banner ── */}
                {activeCall && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="bg-gradient-to-r from-[#0071E3] to-[#34C759] rounded-[20px] p-5 text-white apple-shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <Video className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Doctor is calling</h3>
                                        <p className="text-white/80 text-sm">Video consultation is active — join now</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.open(`https://meet.jit.si/${activeCall.roomName}`, '_blank')}
                                    className="px-6 py-3 bg-white text-[#0071E3] font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
                                >
                                    Join Call
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── Join Video Call by Code ── */}
                {healthData && (healthData.triageLevel === 'High' || healthData.triageLevel === 'Critical') && healthData.status !== 'resolved' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="bg-white rounded-[20px] p-5 apple-shadow border border-[#E5E5EA]/50">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-[#0071E3]/10 rounded-full flex items-center justify-center">
                                    <Video className="w-5 h-5 text-[#0071E3]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1D1D1F]">Join Video Consultation</h3>
                                    <p className="text-xs text-[#86868B]">Enter the room code shared by the doctor</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    id="jitsi-room-code"
                                    placeholder="Paste room code here..."
                                    className="flex-1 px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 border border-[#E5E5EA]/50"
                                />
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('jitsi-room-code') as HTMLInputElement;
                                        const code = input?.value?.trim();
                                        if (code) {
                                            // Support both full URLs and plain room names
                                            const roomName = code.includes('meet.jit.si/')
                                                ? code.split('meet.jit.si/')[1]?.split('#')[0]?.split('?')[0]
                                                : code;
                                            window.open(`https://meet.jit.si/${roomName}`, '_blank');
                                        }
                                    }}
                                    className="px-6 py-3 bg-[#0071E3] text-white font-medium rounded-xl hover:bg-[#0077ED] transition-colors text-sm flex items-center gap-2"
                                >
                                    <Video className="w-4 h-4" />
                                    Join Call
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
                {/* ═══ PATIENT BASIC INFO ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6"
                >
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] mb-3 flex items-center px-1">
                        <User className="w-4 h-4 mr-2" />
                        Patient Basic Info
                    </h3>
                    <div className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden">
                        {/* Name */}
                        <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 flex items-center justify-center mr-4 shrink-0">
                                <User className="w-4 h-4 text-[#0071E3]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-[#86868B] mb-0.5">Name</p>
                                <p className="text-sm font-medium text-[#1D1D1F]">{profile.fullName}</p>
                            </div>
                        </div>

                        {/* Age & Gender */}
                        <div className="grid grid-cols-2 border-b border-[#E5E5EA]/50">
                            <div className="p-4 sm:p-5 border-r border-[#E5E5EA]/50">
                                <p className="text-xs text-[#86868B] mb-0.5">Age</p>
                                <p className="text-sm font-medium text-[#1D1D1F]">{profile.age} years</p>
                            </div>
                            <div className="p-4 sm:p-5">
                                <p className="text-xs text-[#86868B] mb-0.5">Gender</p>
                                <p className="text-sm font-medium text-[#1D1D1F]">{profile.gender}</p>
                            </div>
                        </div>

                        {/* Village */}
                        <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#34C759]/10 flex items-center justify-center mr-4 shrink-0">
                                <MapPin className="w-4 h-4 text-[#34C759]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-[#86868B] mb-0.5">Village / Address</p>
                                <p className="text-sm font-medium text-[#1D1D1F]">{profile.address || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#5856D6]/10 flex items-center justify-center mr-4 shrink-0">
                                <Phone className="w-4 h-4 text-[#5856D6]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-[#86868B] mb-0.5">Phone</p>
                                <p className="text-sm font-medium text-[#1D1D1F]">{profile.phoneNumber || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Registered By & Date */}
                        <div className="p-4 sm:p-5 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#FF9500]/10 flex items-center justify-center mr-4 shrink-0">
                                <Calendar className="w-4 h-4 text-[#FF9500]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-[#86868B] mb-0.5">Registered By</p>
                                <p className="text-sm font-medium text-[#1D1D1F]">
                                    {ashaName || 'ASHA Worker'} &bull;{' '}
                                    {profile.createdAt
                                        ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ═══ CURRENT HEALTH STATUS ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6"
                >
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] mb-3 flex items-center px-1">
                        <Activity className="w-4 h-4 mr-2" />
                        Current Health Status
                    </h3>

                    {healthData ? (
                        <div className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden">
                            {/* Symptoms */}
                            <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mr-3 shrink-0">
                                        <Stethoscope className="w-4 h-4 text-[#FF3B30]" />
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Symptoms</p>
                                </div>
                                <p className="text-sm text-[#1D1D1F] leading-relaxed pl-11">{healthData.symptoms}</p>
                            </div>

                            {/* Risk Level */}
                            <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-[#FF9500]/10 flex items-center justify-center mr-3 shrink-0">
                                        <AlertTriangle className="w-4 h-4 text-[#FF9500]" />
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Risk Level</p>
                                </div>
                                <div className="pl-11">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${riskBadge.bg} ${riskBadge.color}`}>
                                        {riskBadge.text}
                                    </span>
                                    {healthData.possibleConditions.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {healthData.possibleConditions.map((c, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-[#F5F5F7] text-[#1D1D1F] text-xs rounded-full border border-black/5">{c}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI Recommendation */}
                            <div className="p-4 sm:p-5 border-b border-[#E5E5EA]/50">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 flex items-center justify-center mr-3 shrink-0">
                                        <FileText className="w-4 h-4 text-[#0071E3]" />
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">AI Recommendation</p>
                                </div>
                                <p className="text-sm text-[#1D1D1F] leading-relaxed pl-11">{healthData.analysis || 'No analysis available'}</p>
                                {healthData.recommendedActions.length > 0 && (
                                    <ul className="mt-2 pl-11 space-y-1">
                                        {healthData.recommendedActions.map((action, i) => (
                                            <li key={i} className="text-xs text-[#86868B] flex items-start">
                                                <span className="text-[#0071E3] mr-1.5 mt-0.5">•</span>
                                                {action}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Status Indicator — Interactive */}
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full ${statusInfo.bg} flex items-center justify-center mr-3 shrink-0`}>
                                            <Shield className="w-4 h-4" style={{ color: statusInfo.color.replace('text-[', '').replace(']', '') }} />
                                        </div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Update Status</p>
                                    </div>
                                    {updatingStatus && (
                                        <Loader2 className="w-4 h-4 animate-spin text-[#0071E3]" />
                                    )}
                                </div>

                                <div className="pl-11 space-y-2">
                                    <button
                                        onClick={() => handleStatusChange('resolving')}
                                        disabled={updatingStatus}
                                        className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all ${healthData.status !== 'resolved' && healthData.status !== 'pending' && healthData.status === 'resolving'
                                            ? 'bg-[#FF9500]/15 text-[#FF9500] ring-2 ring-[#FF9500]/30 shadow-sm'
                                            : healthData.status === 'pending'
                                                ? 'bg-[#FF9500]/15 text-[#FF9500] ring-2 ring-[#FF9500]/30 shadow-sm'
                                                : 'bg-[#F5F5F7] text-[#86868B] hover:bg-[#FF9500]/10 hover:text-[#FF9500]'
                                            }`}
                                    >
                                        <span className="mr-3 text-base">🟡</span>
                                        Under Monitoring
                                    </button>

                                    <button
                                        onClick={() => handleStatusChange('pending')}
                                        disabled={updatingStatus}
                                        className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all ${(healthData.triageLevel === 'High' || healthData.triageLevel === 'Critical') && healthData.status === 'pending'
                                            ? 'bg-[#FF3B30]/15 text-[#FF3B30] ring-2 ring-[#FF3B30]/30 shadow-sm'
                                            : 'bg-[#F5F5F7] text-[#86868B] hover:bg-[#FF3B30]/10 hover:text-[#FF3B30]'
                                            }`}
                                    >
                                        <span className="mr-3 text-base">🔴</span>
                                        Needs Doctor
                                    </button>

                                    <button
                                        onClick={() => handleStatusChange('resolved')}
                                        disabled={updatingStatus}
                                        className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all ${healthData.status === 'resolved'
                                            ? 'bg-[#34C759]/15 text-[#34C759] ring-2 ring-[#34C759]/30 shadow-sm'
                                            : 'bg-[#F5F5F7] text-[#86868B] hover:bg-[#34C759]/10 hover:text-[#34C759]'
                                            }`}
                                    >
                                        <span className="mr-3 text-base">🟢</span>
                                        Recovered
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 p-8 text-center">
                            <Heart className="w-10 h-10 text-[#C7C7CC] mx-auto mb-3" />
                            <p className="text-[#86868B] text-sm">No health records yet.</p>
                            <p className="text-[#86868B] text-xs mt-1">Run a symptom analysis to generate a health report.</p>
                            <button
                                onClick={() => router.push('/asha/symptoms')}
                                className="mt-4 px-5 py-2 bg-[#0071E3] text-white rounded-full text-sm font-medium hover:bg-[#0077ED] transition-colors"
                            >
                                Run Symptom Analysis
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* ═══ PAST REPORTS (History) ═══ */}
                {history.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-6"
                    >
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] mb-3 flex items-center px-1">
                            <Clock className="w-4 h-4 mr-2" />
                            Past Reports ({history.length})
                        </h3>
                        <div className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden">
                            {history.map((item, index) => (
                                <div key={item.id} className={index !== history.length - 1 ? 'border-b border-[#E5E5EA]/50' : ''}>
                                    <button
                                        onClick={() => setExpandedHistory(expandedHistory === item.id ? null : item.id)}
                                        className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#F5F5F7]/30 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-[#34C759]/10 flex items-center justify-center mr-3 shrink-0">
                                                <FileText className="w-4 h-4 text-[#34C759]" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-[#1D1D1F]">
                                                    {item.triageLevel} Risk — Resolved
                                                </p>
                                                <p className="text-xs text-[#86868B] mt-0.5">
                                                    {new Date(item.resolvedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#34C759]/10 text-[#34C759]">
                                                🟢 Recovered
                                            </span>
                                            {expandedHistory === item.id ? <ChevronUp className="w-4 h-4 text-[#C7C7CC]" /> : <ChevronDown className="w-4 h-4 text-[#C7C7CC]" />}
                                        </div>
                                    </button>

                                    {expandedHistory === item.id && (
                                        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                                            <div className="bg-[#F5F5F7] rounded-2xl p-4 space-y-3">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1">Symptoms</p>
                                                    <p className="text-sm text-[#1D1D1F]">{item.symptoms}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1">AI Analysis</p>
                                                    <p className="text-sm text-[#1D1D1F]">{item.analysis}</p>
                                                </div>
                                                {item.possibleConditions.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1">Conditions</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {item.possibleConditions.map((c, i) => (
                                                                <span key={i} className="px-2 py-0.5 bg-white text-xs rounded-full border border-black/5 text-[#1D1D1F]">{c}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="pt-2 border-t border-black/5 flex items-center gap-4 text-xs text-[#86868B]">
                                                    <span>Escalated: {new Date(item.escalatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                    <span>Resolved: {new Date(item.resolvedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ═══ ACTIONS ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden mb-6"
                >
                    <button
                        onClick={() => router.push('/asha/symptoms')}
                        className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#F5F5F7]/50 transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 flex items-center justify-center mr-4">
                                <Heart className="w-4 h-4 text-[#0071E3]" />
                            </div>
                            <span className="text-sm font-medium text-[#1D1D1F]">Run New Symptom Analysis</span>
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
