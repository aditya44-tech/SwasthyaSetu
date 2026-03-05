'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import DefaultAvatar from '@/components/DefaultAvatar';
import { useRouter } from 'next/navigation';

export default function HighRiskPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    // Build high risk list: patients who have an active case with High/Critical triage
    const highRisk = patients.filter(p => {
        const c = cases.find((cs: any) => cs.patient?.fullName === p.name);
        if (!c || c.status === 'resolved') return false;
        const level = c.analysis?.triage_level;
        return level === 'High' || level === 'Critical';
    });

    return (
        <div className="min-h-screen pb-20">
            <Navbar title="High Risk Alerts" userRole="asha" />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-[#FF3B30]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-[#1D1D1F]">High Risk Patients</h2>
                        <p className="text-sm text-[#86868B]">{highRisk.length} patient{highRisk.length !== 1 ? 's' : ''} needing immediate attention</p>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] apple-shadow border border-[#FF3B30]/10 overflow-hidden">
                    {isLoading ? (
                        <div className="p-10 text-center text-[#86868B]">Loading...</div>
                    ) : highRisk.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="text-[#86868B] mb-1">No high risk patients currently.</p>
                            <p className="text-xs text-[#86868B]">Patients with High or Critical risk levels will appear here.</p>
                        </div>
                    ) : (
                        highRisk.map((patient, i) => {
                            const c = cases.find((cs: any) => cs.patient?.fullName === patient.name);
                            return (
                                <motion.div
                                    key={patient.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => router.push(`/patient/profile?id=${patient.id}`)}
                                    className={`p-4 sm:p-5 flex items-center justify-between hover:bg-[#FFF5F5]/50 transition-colors cursor-pointer ${i !== highRisk.length - 1 ? 'border-b border-[#FF3B30]/10' : ''}`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <DefaultAvatar name={patient.name} size={44} />
                                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#FF3B30] rounded-full border-2 border-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-[#1D1D1F]">{patient.name}</h4>
                                            <p className="text-xs text-[#86868B] mt-0.5">{patient.gender} • {patient.age} yrs</p>
                                            {c?.analysis?.triage_level && (
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF3B30]/10 text-[#FF3B30]">
                                                    {c.analysis.triage_level} Risk
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
