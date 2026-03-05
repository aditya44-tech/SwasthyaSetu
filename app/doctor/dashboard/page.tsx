'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Video, Clock, Activity, Filter, AlertTriangle, ChevronDown, ChevronUp, FileText, User, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface EscalatedCase {
  id: number;
  patient: {
    fullName: string;
    age: string;
    gender: string;
    phoneNumber?: string;
    address?: string;
    pregnancyStatus?: string;
  };
  symptoms: string;
  analysis: {
    symptoms_en: string;
    analysis: string;
    triage_level: 'Low' | 'Medium' | 'High' | 'Critical';
    risk_factors: string[];
    recommended_actions: string[];
    suggested_specialty: string;
    possible_conditions: string[];
    recommended_action_summary: string;
    eligible_schemes: { name: string; description: string }[];
  };
  escalatedAt: string;
  status: string;
}

const mockRequests = [
  { id: 1001, patient: 'Radha Devi', asha: 'Sunita Sharma', age: 32, condition: 'High Risk Pregnancy - Elevated BP', urgency: 'high', waitTime: '5 mins' },
  { id: 1002, patient: 'Ramesh Kumar', asha: 'Anita Patel', age: 55, condition: 'Severe Chest Pain', urgency: 'high', waitTime: '2 mins' },
  { id: 1003, patient: 'Little Aarav', asha: 'Sunita Sharma', age: 2, condition: 'High Fever & Rash', urgency: 'medium', waitTime: '15 mins' },
  { id: 1004, patient: 'Kamla Bai', asha: 'Pooja Singh', age: 68, condition: 'Routine Diabetes Check', urgency: 'low', waitTime: '45 mins' },
];

export default function DoctorDashboard() {
  const router = useRouter();
  const [escalatedCases, setEscalatedCases] = useState<EscalatedCase[]>([]);
  const [expandedCase, setExpandedCase] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'escalated'>('all');

  useEffect(() => {
    const stored = localStorage.getItem('escalatedCases');
    if (stored) {
      try {
        setEscalatedCases(JSON.parse(stored));
      } catch { /* ignore parse errors */ }
    }
  }, []);

  const getTimeSince = (isoDate: string) => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const totalPending = escalatedCases.length + mockRequests.length;
  const urgentCount = escalatedCases.filter(c => c.analysis.triage_level === 'High' || c.analysis.triage_level === 'Critical').length
    + mockRequests.filter(r => r.urgency === 'high').length;

  return (
    <div className="min-h-screen pb-20">
      <Navbar
        title="Consultations"
        userRole="doctor"
        profileImage="https://picsum.photos/seed/doctor/200/200"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0"
        >
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-1">Dr. Mehta</h2>
            <p className="text-[#86868B]">
              You have {totalPending} pending consultation requests
              {urgentCount > 0 && <span className="text-[#FF3B30] font-medium"> • {urgentCount} urgent</span>}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors apple-shadow ${activeFilter === 'all' ? 'bg-[#0071E3] text-white' : 'bg-white border border-[#E5E5EA] hover:bg-[#F5F5F7]'
                }`}
            >
              All ({totalPending})
            </button>
            <button
              onClick={() => setActiveFilter('urgent')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors apple-shadow ${activeFilter === 'urgent' ? 'bg-[#FF3B30] text-white' : 'bg-white border border-[#E5E5EA] hover:bg-[#F5F5F7]'
                }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              Urgent ({urgentCount})
            </button>
            <button
              onClick={() => setActiveFilter('escalated')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors apple-shadow ${activeFilter === 'escalated' ? 'bg-[#FF9500] text-white' : 'bg-white border border-[#E5E5EA] hover:bg-[#F5F5F7]'
                }`}
            >
              <Activity className="w-3.5 h-3.5 mr-1.5" />
              Escalated ({escalatedCases.length})
            </button>
          </div>
        </motion.div>

        {/* ── Escalated Cases from ASHA Workers ── */}
        {escalatedCases.length > 0 && activeFilter !== 'urgent' && (
          <div className="mb-8">
            {activeFilter !== 'escalated' && (
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-[#FF9500]" />
                Escalated by ASHA Workers
              </h3>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {escalatedCases.map((esCase, index) => (
                <motion.div
                  key={esCase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white rounded-[24px] p-6 apple-shadow border hover:shadow-lg transition-shadow ${esCase.analysis.triage_level === 'Critical' || esCase.analysis.triage_level === 'High'
                      ? 'border-[#FF3B30]/30 ring-1 ring-[#FF3B30]/10'
                      : 'border-[#FF9500]/30 ring-1 ring-[#FF9500]/10'
                    }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#0071E3]/20 to-[#34C759]/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-[#0071E3]" />
                        </div>
                        {(esCase.analysis.triage_level === 'High' || esCase.analysis.triage_level === 'Critical') && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-white animate-pulse" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-[#1D1D1F]">{esCase.patient.fullName}</h3>
                        <p className="text-sm text-[#86868B]">{esCase.patient.age} yrs • {esCase.patient.gender}</p>
                      </div>
                    </div>

                    {esCase.analysis.triage_level === 'Critical' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FF3B30]/10 text-[#FF3B30] animate-pulse">
                        🚨 CRITICAL
                      </span>
                    ) : esCase.analysis.triage_level === 'High' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FF3B30]/10 text-[#FF3B30]">
                        Urgent
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FF9500]/10 text-[#FF9500]">
                        Priority
                      </span>
                    )}
                  </div>

                  {/* Condition & Symptoms */}
                  <div className="bg-[#F5F5F7] rounded-2xl p-4 mb-4">
                    <p className="text-sm font-medium text-[#1D1D1F] mb-1">Reported Symptoms</p>
                    <p className="text-sm text-[#86868B]">{esCase.symptoms}</p>
                  </div>

                  {/* Triage Level & Specialty */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${esCase.analysis.triage_level === 'Critical' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' :
                        esCase.analysis.triage_level === 'High' ? 'bg-[#FF9500]/10 text-[#FF9500]' :
                          'bg-[#0071E3]/10 text-[#0071E3]'
                      }`}>
                      {esCase.analysis.triage_level} Risk
                    </span>
                    <span className="text-xs text-[#86868B]">•</span>
                    <span className="text-xs text-[#86868B] font-medium">{esCase.analysis.suggested_specialty}</span>
                  </div>

                  {/* Expandable AI Report */}
                  <button
                    onClick={() => setExpandedCase(expandedCase === esCase.id ? null : esCase.id)}
                    className="w-full flex items-center justify-between text-sm text-[#0071E3] font-medium py-2 hover:text-[#0077ED] transition-colors"
                  >
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1.5" />
                      View Full AI Report
                    </span>
                    {expandedCase === esCase.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <AnimatePresence>
                    {expandedCase === esCase.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-[#F5F5F7] rounded-2xl p-4 mt-2 space-y-4">
                          {/* Analysis */}
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1">AI Analysis</p>
                            <p className="text-sm text-[#1D1D1F] leading-relaxed">{esCase.analysis.analysis}</p>
                          </div>

                          {/* Possible Conditions */}
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-2">Possible Conditions</p>
                            <div className="flex flex-wrap gap-1">
                              {esCase.analysis.possible_conditions.map((c, i) => (
                                <span key={i} className="px-2 py-0.5 bg-white text-[#1D1D1F] text-xs rounded-full border border-black/5">{c}</span>
                              ))}
                            </div>
                          </div>

                          {/* Risk Factors */}
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-2">Risk Factors</p>
                            <ul className="space-y-1">
                              {esCase.analysis.risk_factors.map((f, i) => (
                                <li key={i} className="text-xs text-[#1D1D1F] flex items-start">
                                  <AlertTriangle className="w-3 h-3 text-[#FF9500] mr-1.5 mt-0.5 shrink-0" />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Patient Contact */}
                          {esCase.patient.phoneNumber && (
                            <div className="flex items-center gap-4 pt-2 border-t border-black/5">
                              {esCase.patient.phoneNumber && (
                                <span className="flex items-center text-xs text-[#86868B]">
                                  <Phone className="w-3 h-3 mr-1" />{esCase.patient.phoneNumber}
                                </span>
                              )}
                              {esCase.patient.address && (
                                <span className="flex items-center text-xs text-[#86868B]">
                                  <MapPin className="w-3 h-3 mr-1" />{esCase.patient.address}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm text-[#86868B]">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {getTimeSince(esCase.escalatedAt)}
                    </div>

                    <button
                      onClick={() => router.push('/doctor/call')}
                      className={`px-6 py-2.5 font-medium rounded-full transition-colors flex items-center shadow-sm ${esCase.analysis.triage_level === 'Critical' || esCase.analysis.triage_level === 'High'
                          ? 'bg-[#FF3B30] hover:bg-[#E63529] text-white shadow-red-500/20'
                          : 'bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-blue-500/20'
                        }`}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Start Call
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Regular Mock Requests ── */}
        {activeFilter !== 'escalated' && (
          <div>
            {escalatedCases.length > 0 && activeFilter === 'all' && (
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Queued Consultations
              </h3>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockRequests
                .filter(r => activeFilter === 'all' || (activeFilter === 'urgent' && r.urgency === 'high'))
                .map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-[24px] p-6 apple-shadow border border-[#E5E5EA]/50 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-black/5">
                            <Image src={`https://picsum.photos/seed/patient${request.id}/100/100`} alt={request.patient} width={48} height={48} className="object-cover" />
                          </div>
                          {request.urgency === 'high' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-[#1D1D1F]">{request.patient}</h3>
                          <p className="text-sm text-[#86868B]">{request.age} yrs • via {request.asha}</p>
                        </div>
                      </div>

                      {request.urgency === 'high' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#FF3B30]/10 text-[#FF3B30]">
                          Urgent
                        </span>
                      ) : request.urgency === 'medium' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#FF9500]/10 text-[#FF9500]">
                          Priority
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black/5 text-[#86868B]">
                          Routine
                        </span>
                      )}
                    </div>

                    <div className="bg-[#F5F5F7] rounded-2xl p-4 mb-6">
                      <p className="text-sm font-medium text-[#1D1D1F] mb-1">Reported Condition</p>
                      <p className="text-sm text-[#86868B]">{request.condition}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-[#86868B]">
                        <Clock className="w-4 h-4 mr-1.5" />
                        Waiting: {request.waitTime}
                      </div>

                      <button
                        onClick={() => router.push('/doctor/call')}
                        className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium rounded-full transition-colors flex items-center shadow-sm shadow-blue-500/20"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Call
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
