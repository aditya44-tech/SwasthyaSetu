'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Video, Clock, Activity, Filter, AlertTriangle, ChevronDown, ChevronUp, FileText, User, MapPin, Phone } from 'lucide-react';
import DefaultAvatar from '@/components/DefaultAvatar';
import { useRouter } from 'next/navigation';

interface EscalatedCase {
  id: string; // Changed from number to string to support MongoDB _id
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


export default function DoctorDashboard() {
  const router = useRouter();
  const [escalatedCases, setEscalatedCases] = useState<EscalatedCase[]>([]);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'escalated'>('all');
  const [loadingCases, setLoadingCases] = useState(true);
  const [userName, setUserName] = useState('Doctor');

  useEffect(() => {
    // Load user name from session
    const saved = localStorage.getItem('loggedInUser');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setUserName(user.name || 'Doctor');
      } catch { /* ignore */ }
    }

    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases');
        if (res.ok) {
          const data = await res.json();
          setEscalatedCases(data.cases || []);
        }
      } catch (err) {
        console.error('Error fetching escalated cases:', err);
      } finally {
        setLoadingCases(false);
      }
    };

    fetchCases();

    // Optional polling for new cases
    const interval = setInterval(fetchCases, 10000);
    return () => clearInterval(interval);
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

  const totalPending = escalatedCases.length;
  const urgentCount = escalatedCases.filter(c => c.analysis.triage_level === 'High' || c.analysis.triage_level === 'Critical').length;

  return (
    <div className="min-h-screen pb-20">
      <Navbar
        title="Consultations"
        userRole="doctor"

      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0"
        >
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-1">{userName}</h2>
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
        {loadingCases ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[#0071E3] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-[#86868B] font-medium">Loading live cases...</span>
          </div>
        ) : escalatedCases.length > 0 && (
          <div className="mb-8">
            {activeFilter === 'urgent' && (
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FF3B30] mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Urgent Cases
              </h3>
            )}
            {activeFilter === 'escalated' && (
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FF9500] mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Escalated by ASHA Workers
              </h3>
            )}
            {activeFilter === 'all' && (
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0071E3] mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                All Cases
              </h3>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {escalatedCases
                .filter(esCase => {
                  if (activeFilter === 'urgent') return esCase.analysis.triage_level === 'High' || esCase.analysis.triage_level === 'Critical';
                  if (activeFilter === 'escalated') return esCase.analysis.triage_level !== 'High' && esCase.analysis.triage_level !== 'Critical';
                  return true;
                })
                .map((esCase, index) => (
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
                        onClick={() => router.push(`/doctor/call?caseId=${esCase.id}&patient=${encodeURIComponent(esCase.patient.fullName)}`)}
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
      </main>
    </div>
  );
}
