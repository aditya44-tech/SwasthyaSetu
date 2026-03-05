'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { ChevronRight, Search, Loader2 } from 'lucide-react';
import DefaultAvatar from '@/components/DefaultAvatar';
import { useRouter, useSearchParams } from 'next/navigation';

function PatientsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [patients, setPatients] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const load = async () => {
            try {
                const [pRes, cRes] = await Promise.all([
                    fetch('/api/patients'),
                    fetch('/api/cases')
                ]);
                if (pRes.ok) {
                    const d = await pRes.json();
                    setPatients(d.patients || []);
                }
                if (cRes.ok) {
                    const d = await cRes.json();
                    setCases(d.cases || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const getStatus = (name: string) => {
        const c = cases.find((cs: any) => cs.patient?.fullName === name);
        if (!c) return 'none';
        if (c.status === 'resolved') return 'recovered';
        const level = c.analysis?.triage_level;
        if (level === 'High' || level === 'Critical') return 'needs_doctor';
        return 'monitoring';
    };

    const statusLabel: Record<string, { emoji: string; text: string; bg: string; color: string }> = {
        needs_doctor: { emoji: '🔴', text: 'Needs Doctor', bg: 'bg-[#FF3B30]/10', color: 'text-[#FF3B30]' },
        monitoring: { emoji: '🟡', text: 'Monitoring', bg: 'bg-[#FF9500]/10', color: 'text-[#FF9500]' },
        recovered: { emoji: '🟢', text: 'Recovered', bg: 'bg-[#34C759]/10', color: 'text-[#34C759]' },
        none: { emoji: '⚪', text: 'New', bg: 'bg-black/5', color: 'text-[#86868B]' },
    };

    const filtered = patients.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.address?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-20">
            <Navbar title="Total Patients" userRole="asha" />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B]" />
                    <input
                        type="text"
                        placeholder="Search patients by name or village..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl apple-shadow border border-[#E5E5EA]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30"
                    />
                </div>

                <p className="text-sm text-[#86868B] mb-4 px-1">{filtered.length} patient{filtered.length !== 1 ? 's' : ''}</p>

                <div className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden">
                    {isLoading ? (
                        <div className="p-10 text-center text-[#86868B]">Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-10 text-center text-[#86868B]">No patients found.</div>
                    ) : (
                        filtered.map((patient, i) => {
                            const s = getStatus(patient.name);
                            const badge = statusLabel[s];
                            return (
                                <motion.div
                                    key={patient.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    onClick={() => router.push(`/patient/profile?id=${patient.id}`)}
                                    className={`p-4 sm:p-5 flex items-center justify-between hover:bg-[#F5F5F7]/50 transition-colors cursor-pointer ${i !== filtered.length - 1 ? 'border-b border-[#E5E5EA]/50' : ''}`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <DefaultAvatar name={patient.name} size={44} />
                                        <div>
                                            <h4 className="font-medium text-[#1D1D1F]">{patient.name}</h4>
                                            <p className="text-xs text-[#86868B] mt-0.5">{patient.gender} • {patient.age} yrs • {patient.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.color}`}>
                                            {badge.emoji} {badge.text}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}

export default function AllPatientsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
            </div>
        }>
            <PatientsContent />
        </Suspense>
    );
}
