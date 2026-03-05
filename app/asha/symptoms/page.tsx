'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import {
  Mic,
  Languages,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Stethoscope,
  ArrowRight,
  Loader2,
  Volume2,
  User,
  ShieldCheck,
  ClipboardList,
  Calendar,
  Bell,
  CircleAlert
} from 'lucide-react';

type TriageLevel = 'Low' | 'Medium' | 'High' | 'Critical';

interface AnalysisResult {
  symptoms_en: string;
  analysis: string;
  triage_level: TriageLevel;
  risk_factors: string[];
  recommended_actions: string[];
  suggested_specialty: string;
  possible_conditions: string[];
  recommended_action_summary: string;
  eligible_schemes: {
    name: string;
    description: string;
  }[];
}

interface PatientData {
  id?: string;
  fullName: string;
  age: string;
  gender: string;
  phoneNumber?: string;
  address?: string;
  pregnancyStatus?: string;
}

export default function SymptomAnalysis() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [escalated, setEscalated] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  useEffect(() => {
    const savedPatient = localStorage.getItem('currentPatient');
    if (savedPatient) {
      setPatient(JSON.parse(savedPatient));
    }
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    const patientContext = patient
      ? `Patient Context: Name: ${patient.fullName}, Age: ${patient.age}, Gender: ${patient.gender}${patient.pregnancyStatus ? `, Pregnancy Status: ${patient.pregnancyStatus}` : ''}.`
      : '';

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, patientContext }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze symptoms');
      }

      setResult(data as AnalysisResult);
      setEscalated(false);
      setShowFollowUp(false);

      // Handle High Risk Alert — save alert to MongoDB
      if ((data.triage_level === 'High' || data.triage_level === 'Critical') && patient) {
        const newAlert = {
          patientName: patient.fullName,
          patientId: patient.id,
          riskLevel: data.triage_level,
          condition: data.possible_conditions[0] || 'Unknown',
          date: new Date().toLocaleString()
        };
        fetch('/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAlert)
        }).catch(err => console.error('Failed to save alert:', err));
      }

      // Auto-escalate High/Critical to doctor dashboard
      if (data.triage_level === 'High' || data.triage_level === 'Critical') {
        escalateToDoctor(data as AnalysisResult);
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze symptoms. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Escalation to Doctor Dashboard ──
  const escalateToDoctor = async (analysisResult: AnalysisResult) => {
    try {
      const newCase = {
        patient: patient ? {
          fullName: patient.fullName,
          age: patient.age,
          gender: patient.gender,
          phoneNumber: patient.phoneNumber,
          address: patient.address,
          pregnancyStatus: patient.pregnancyStatus,
        } : {
          fullName: 'Unknown Patient',
          age: 'N/A',
          gender: 'N/A',
        },
        symptoms: input,
        analysis: analysisResult,
        status: 'pending',
      };

      const res = await fetch('/api/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCase),
      });

      if (!res.ok) {
        throw new Error('Failed to route case to database');
      }

      setEscalated(true);
    } catch (err) {
      console.error('Failed to escalate:', err);
      // Optional: show an error state/toast here if desired
    }
  };

  const handleScheduleFollowUp = async () => {
    setShowFollowUp(true);
    // Save follow-up to MongoDB
    const newFollowUp = {
      patientName: patient?.fullName || 'Unknown Patient',
      patientId: patient?.id,
      symptoms: input,
      triageLevel: result?.triage_level,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    };
    try {
      await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFollowUp)
      });
    } catch (err) {
      console.error('Failed to schedule follow-up:', err);
    }
  };

  // ── Web Speech API for voice input ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const toggleRecording = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Default to Hindi; also recognizes English mixed input
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = input; // Append to existing text

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + transcript;
        } else {
          interim = transcript;
        }
      }
      setInput(finalTranscript + (interim ? ' ' + interim : ''));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access.');
      } else if (event.error !== 'aborted') {
        setError('Voice input error. Please try again.');
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setError(null);
  };

  const getTriageColor = (level: TriageLevel) => {
    switch (level) {
      case 'Critical': return 'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/20';
      case 'High': return 'text-[#FF9500] bg-[#FF9500]/10 border-[#FF9500]/20';
      case 'Medium': return 'text-[#0071E3] bg-[#0071E3]/10 border-[#0071E3]/20';
      case 'Low': return 'text-[#34C759] bg-[#34C759]/10 border-[#34C759]/20';
      default: return 'text-[#86868B] bg-black/5 border-transparent';
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar
        title="AI Symptom Checker"
        userRole="asha"
        
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Smart Triage</h2>
            <p className="text-[#86868B]">Input symptoms in any language for instant AI analysis and risk prediction.</p>
          </div>
          {patient && (
            <div className="bg-white px-6 py-3 rounded-2xl apple-shadow border border-[#E5E5EA]/50 flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-[#0071E3]" />
              </div>
              <div>
                <p className="text-xs text-[#86868B] font-medium uppercase tracking-wider">Analyzing For</p>
                <p className="text-sm font-semibold text-[#1D1D1F]">{patient.fullName} • {patient.age} yrs • {patient.gender}</p>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[32px] p-6 apple-shadow border border-[#E5E5EA]/50">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-[#1D1D1F] flex items-center">
                  <Languages className="w-4 h-4 mr-2 text-[#0071E3]" />
                  Patient Symptoms
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleRecording}
                    className={`p-2 rounded-full transition-all ${isRecording ? 'bg-[#FF3B30] text-white animate-pulse' : 'bg-black/5 text-[#1D1D1F] hover:bg-black/10'
                      }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe symptoms here (e.g., 'Patient has high fever for 3 days and cough')..."
                className="w-full h-40 bg-[#F5F5F7] rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 transition-all resize-none"
              />

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !input.trim()}
                className="w-full mt-4 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-medium transition-all flex items-center justify-center group"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5 mr-2" />
                    Analyze Symptoms
                  </>
                )}
              </button>

              {error && (
                <p className="mt-3 text-xs text-[#FF3B30] text-center">{error}</p>
              )}
            </div>

            <div className="bg-[#F5F5F7] rounded-[24px] p-5 border border-black/5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-3">Quick Tips</h4>
              <ul className="space-y-2">
                <li className="text-xs text-[#1D1D1F] flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3] mt-1 mr-2 shrink-0" />
                  Mention duration of symptoms
                </li>
                <li className="text-xs text-[#1D1D1F] flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3] mt-1 mr-2 shrink-0" />
                  Note any visible signs (rashes, swelling)
                </li>
                <li className="text-xs text-[#1D1D1F] flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3] mt-1 mr-2 shrink-0" />
                  Include patient&apos;s age and gender if possible
                </li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Triage Header */}
                  <div className={`rounded-[32px] p-8 border ${getTriageColor(result.triage_level)} apple-shadow-lg`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Triage Level</p>
                          <h3 className="text-2xl font-bold">{result.triage_level} Risk</h3>
                        </div>
                      </div>
                      <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Recommended Action</p>
                        <p className="font-bold text-lg">{result.recommended_action_summary}</p>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                      <p className="text-sm font-medium mb-1 flex items-center">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Summary (English)
                      </p>
                      <p className="text-sm opacity-90 leading-relaxed italic">&quot;{result.symptoms_en}&quot;</p>
                    </div>
                  </div>

                  {/* Possible Conditions & Specialty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-[32px] p-6 apple-shadow border border-[#E5E5EA]/50">
                      <div className="flex items-center mb-4">
                        <ClipboardList className="w-5 h-5 text-[#0071E3] mr-2" />
                        <h4 className="font-semibold">Possible Conditions</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.possible_conditions.map((condition, i) => (
                          <span key={i} className="px-3 py-1 bg-[#F5F5F7] text-[#1D1D1F] text-xs font-medium rounded-full border border-black/5">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-[32px] p-6 apple-shadow border border-[#E5E5EA]/50">
                      <div className="flex items-center mb-4">
                        <Stethoscope className="w-5 h-5 text-[#34C759] mr-2" />
                        <h4 className="font-semibold">Suggested Specialty</h4>
                      </div>
                      <p className="text-sm text-[#1D1D1F] font-medium">{result.suggested_specialty}</p>
                      <p className="text-xs text-[#86868B] mt-1">Consultation recommended with this department.</p>
                    </div>
                  </div>

                  {/* Scheme Eligibility */}
                  <div className="bg-gradient-to-br from-[#F2FDF4] to-white rounded-[32px] p-8 apple-shadow border border-[#34C759]/10">
                    <div className="flex items-center mb-6">
                      <ShieldCheck className="w-6 h-6 text-[#34C759] mr-3" />
                      <h4 className="text-xl font-bold text-[#1D1D1F]">Eligible Health Schemes</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.eligible_schemes.map((scheme, i) => (
                        <div key={i} className="bg-white/60 p-4 rounded-2xl border border-[#34C759]/20">
                          <h5 className="font-bold text-[#1D1D1F] text-sm mb-1">{scheme.name}</h5>
                          <p className="text-xs text-[#86868B] leading-relaxed">{scheme.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analysis Details */}
                  <div className="bg-white rounded-[32px] p-8 apple-shadow border border-[#E5E5EA]/50">
                    <div className="flex items-center mb-6">
                      <Activity className="w-5 h-5 text-[#0071E3] mr-3" />
                      <h4 className="text-lg font-semibold">AI Clinical Analysis</h4>
                    </div>
                    <p className="text-[#1D1D1F] text-sm leading-relaxed mb-8">
                      {result.analysis}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-4">Risk Factors</h5>
                        <ul className="space-y-3">
                          {result.risk_factors.map((factor, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <AlertTriangle className="w-4 h-4 text-[#FF9500] mr-2 shrink-0 mt-0.5" />
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-4">Recommended Actions</h5>
                        <ul className="space-y-3">
                          {result.recommended_actions.map((action, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <CheckCircle2 className="w-4 h-4 text-[#34C759] mr-2 shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* ── Triage-based Escalation Section ── */}
                    <div className="mt-10 pt-8 border-t border-[#E5E5EA]/50">

                      {/* HIGH / CRITICAL — Auto-escalated banner */}
                      {(result.triage_level === 'High' || result.triage_level === 'Critical') && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mb-6 bg-gradient-to-r from-[#FF3B30]/10 to-[#FF9500]/10 border border-[#FF3B30]/20 rounded-2xl p-5"
                        >
                          <div className="flex items-center mb-2">
                            <CircleAlert className="w-5 h-5 text-[#FF3B30] mr-2" />
                            <h4 className="font-bold text-[#FF3B30] text-sm uppercase tracking-wider">Immediate Doctor Attention Required</h4>
                          </div>
                          <p className="text-sm text-[#1D1D1F] mb-3">
                            This case has been <strong>automatically escalated</strong> to the doctor dashboard as <strong>High Priority</strong>.
                          </p>
                          <div className="flex items-center text-xs text-[#34C759] font-medium">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Case sent to Doctor Dashboard • Patient marked as High Priority
                          </div>
                        </motion.div>
                      )}

                      {/* MEDIUM — Doctor consultation recommended */}
                      {result.triage_level === 'Medium' && !escalated && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mb-6 bg-gradient-to-r from-[#FF9500]/10 to-[#FFD60A]/10 border border-[#FF9500]/20 rounded-2xl p-5"
                        >
                          <div className="flex items-center mb-2">
                            <Bell className="w-5 h-5 text-[#FF9500] mr-2" />
                            <h4 className="font-bold text-[#FF9500] text-sm uppercase tracking-wider">Doctor Consultation Recommended</h4>
                          </div>
                          <p className="text-sm text-[#86868B]">
                            Based on the analysis, a doctor should review this case. Use the buttons below to escalate or schedule follow-up.
                          </p>
                        </motion.div>
                      )}

                      {/* Escalation success message */}
                      {escalated && result.triage_level === 'Medium' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 bg-[#34C759]/10 border border-[#34C759]/20 rounded-2xl p-5"
                        >
                          <div className="flex items-center text-[#34C759] font-medium text-sm">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Case successfully escalated to Doctor Dashboard with full report.
                          </div>
                        </motion.div>
                      )}

                      {/* Follow-up scheduled message */}
                      {showFollowUp && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 bg-[#0071E3]/10 border border-[#0071E3]/20 rounded-2xl p-5"
                        >
                          <div className="flex items-center text-[#0071E3] font-medium text-sm">
                            <Calendar className="w-5 h-5 mr-2" />
                            Follow-up scheduled for {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
                          </div>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Escalate button — for Medium risk (manual), hidden if already escalated or High/Critical (auto) */}
                        {result.triage_level === 'Medium' && !escalated && (
                          <button
                            onClick={() => escalateToDoctor(result)}
                            className="flex-1 bg-[#FF9500] text-white py-4 rounded-2xl font-medium hover:bg-[#E88B00] transition-all flex items-center justify-center shadow-lg shadow-orange-500/20"
                          >
                            <Stethoscope className="w-5 h-5 mr-2" />
                            Escalate to Doctor
                          </button>
                        )}

                        {/* Schedule Follow-up — for Medium risk */}
                        {result.triage_level === 'Medium' && !showFollowUp && (
                          <button
                            onClick={handleScheduleFollowUp}
                            className="flex-1 bg-[#0071E3] text-white py-4 rounded-2xl font-medium hover:bg-[#0077ED] transition-all flex items-center justify-center shadow-lg shadow-blue-500/20"
                          >
                            <Calendar className="w-5 h-5 mr-2" />
                            Schedule Follow-up
                          </button>
                        )}

                        {/* View Doctor Dashboard — for High/Critical */}
                        {(result.triage_level === 'High' || result.triage_level === 'Critical') && (
                          <button
                            onClick={() => window.open('/doctor/dashboard', '_blank')}
                            className="flex-1 bg-[#FF3B30] text-white py-4 rounded-2xl font-medium hover:bg-[#E63529] transition-all flex items-center justify-center shadow-lg shadow-red-500/20"
                          >
                            <ArrowRight className="w-5 h-5 mr-2" />
                            View Doctor Dashboard
                          </button>
                        )}

                        {/* New Analysis — always visible */}
                        <button
                          onClick={() => { setResult(null); setEscalated(false); setShowFollowUp(false); }}
                          className="flex-1 bg-black/5 text-[#1D1D1F] py-4 rounded-2xl font-medium hover:bg-black/10 transition-all"
                        >
                          New Analysis
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 rounded-[40px] border-2 border-dashed border-[#E5E5EA]"
                >
                  <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                    <Activity className="w-10 h-10 text-[#86868B]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready for Analysis</h3>
                  <p className="text-[#86868B] max-w-xs">
                    Enter patient symptoms on the left to get a smart triage report and risk prediction.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
