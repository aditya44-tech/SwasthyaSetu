'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOff, Copy, CheckCircle2, ExternalLink, Users, Share2, FileText, Pill, AlertTriangle, Activity } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function VideoCallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  const caseId = searchParams.get('caseId') || '';
  const patientName = searchParams.get('patient') || 'Patient';

  const [roomName] = useState(() => {
    const param = searchParams.get('room');
    if (param) return param;
    const id = Math.random().toString(36).substring(2, 10);
    return `swasthya-setu-${id}`;
  });

  const [copied, setCopied] = useState(false);
  const [callActive, setCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [consultationId, setConsultationId] = useState('');
  const [showPostCall, setShowPostCall] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Post-call form
  const [notes, setNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [patientStatus, setPatientStatus] = useState('');

  // Create consultation record when call starts
  useEffect(() => {
    if (!caseId) return;
    const createConsultation = async () => {
      try {
        const res = await fetch('/api/consultations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caseId, patientName, roomName }),
        });
        if (res.ok) {
          const data = await res.json();
          setConsultationId(data.consultation._id);
        }
      } catch (e) { console.error(e); }
    };
    createConsultation();
  }, [caseId, patientName, roomName]);

  // Call timer
  useEffect(() => {
    if (!callActive) return;
    const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [callActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEndCall = () => {
    setCallActive(false);
    setShowPostCall(true);
  };

  const handleSaveConsultation = async () => {
    setSaving(true);
    try {
      // Save consultation notes
      if (consultationId) {
        await fetch('/api/consultations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ consultationId, notes, prescriptions, riskLevel, patientStatus }),
        });
      }

      // Update case status if specified
      if (patientStatus && caseId) {
        await fetch('/api/cases/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caseId, status: patientStatus === 'resolved' ? 'resolved' : 'resolving' }),
        });
      }

      setSaved(true);
      setTimeout(() => router.push('/doctor/dashboard'), 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/doctor/call?room=${roomName}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.disableDeepLinking=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_BRAND_WATERMARK=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","chat","raisehand","tileview","hangup","fullscreen"]`;

  // ─── Post-Call Form ───
  if (showPostCall) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F7] to-white">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#34C759]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#34C759]" />
              </div>
              <h1 className="text-2xl font-semibold text-[#1D1D1F] mb-1">Call Ended</h1>
              <p className="text-[#86868B]">Duration: {formatTime(callDuration)} • {patientName}</p>
            </div>

            {saved ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-[#34C759] mx-auto mb-4" />
                <p className="text-xl font-semibold text-[#1D1D1F]">Consultation Saved!</p>
                <p className="text-[#86868B] mt-1">Redirecting to dashboard...</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Consultation Notes */}
                <div className="bg-white rounded-[20px] p-6 apple-shadow border border-[#E5E5EA]/50">
                  <div className="flex items-center mb-4">
                    <FileText className="w-5 h-5 text-[#0071E3] mr-2" />
                    <h3 className="font-semibold text-[#1D1D1F]">Consultation Notes</h3>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your consultation notes here... Include observations, diagnosis, and follow-up instructions."
                    className="w-full h-32 p-4 bg-[#F5F5F7] rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 border border-[#E5E5EA]/50"
                  />
                </div>

                {/* Prescriptions */}
                <div className="bg-white rounded-[20px] p-6 apple-shadow border border-[#E5E5EA]/50">
                  <div className="flex items-center mb-4">
                    <Pill className="w-5 h-5 text-[#FF9500] mr-2" />
                    <h3 className="font-semibold text-[#1D1D1F]">Prescribe Medicines</h3>
                  </div>
                  <textarea
                    value={prescriptions}
                    onChange={(e) => setPrescriptions(e.target.value)}
                    placeholder="List prescribed medicines with dosage and duration...&#10;e.g. Paracetamol 500mg - twice daily for 5 days"
                    className="w-full h-28 p-4 bg-[#F5F5F7] rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF9500]/30 border border-[#E5E5EA]/50"
                  />
                </div>

                {/* Update Risk Level */}
                <div className="bg-white rounded-[20px] p-6 apple-shadow border border-[#E5E5EA]/50">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-[#FF3B30] mr-2" />
                    <h3 className="font-semibold text-[#1D1D1F]">Update Risk Level</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['Low', 'Medium', 'High', 'Critical'].map(level => (
                      <button
                        key={level}
                        onClick={() => setRiskLevel(level)}
                        className={`py-3 rounded-xl text-sm font-medium transition-all ${riskLevel === level
                            ? level === 'Low' ? 'bg-[#34C759] text-white shadow-lg shadow-green-500/20'
                              : level === 'Medium' ? 'bg-[#FF9500] text-white shadow-lg shadow-orange-500/20'
                                : level === 'High' ? 'bg-[#FF3B30] text-white shadow-lg shadow-red-500/20'
                                  : 'bg-[#AF1D1D] text-white shadow-lg shadow-red-800/20'
                            : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5EA]'
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mark Patient Status */}
                <div className="bg-white rounded-[20px] p-6 apple-shadow border border-[#E5E5EA]/50">
                  <div className="flex items-center mb-4">
                    <Activity className="w-5 h-5 text-[#0071E3] mr-2" />
                    <h3 className="font-semibold text-[#1D1D1F]">Mark Patient Status</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'resolving', label: '🟡 Under Monitoring', color: 'bg-[#FF9500]' },
                      { value: 'resolved', label: '🟢 Recovered', color: 'bg-[#34C759]' },
                      { value: 'pending', label: '🔴 Needs Follow-up', color: 'bg-[#FF3B30]' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setPatientStatus(opt.value)}
                        className={`py-3 px-2 rounded-xl text-xs font-medium transition-all ${patientStatus === opt.value
                            ? `${opt.color} text-white shadow-lg`
                            : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5EA]'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => router.push('/doctor/dashboard')}
                    className="flex-1 py-4 rounded-2xl text-sm font-medium bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5EA] transition-colors"
                  >
                    Skip & Return
                  </button>
                  <button
                    onClick={handleSaveConsultation}
                    disabled={saving}
                    className="flex-[2] py-4 rounded-2xl text-sm font-semibold bg-[#0071E3] text-white hover:bg-[#0077ED] transition-colors apple-shadow disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Consultation'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Active Call View ───
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1D1D1F] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between z-20"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-[#34C759] rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Call with {patientName}</span>
          </div>
          <span className="text-white/40 text-sm font-mono">{formatTime(callDuration)}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={copyRoomLink}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
          >
            {copied ? (
              <><CheckCircle2 className="w-4 h-4 text-[#34C759]" /><span className="text-[#34C759]">Copied!</span></>
            ) : (
              <><Share2 className="w-4 h-4" /><span className="hidden sm:inline">Share Link</span></>
            )}
          </button>

          <a
            href={`https://meet.jit.si/${roomName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open External</span>
          </a>

          <button
            onClick={handleEndCall}
            className="flex items-center space-x-2 px-5 py-2 rounded-full bg-[#FF3B30] hover:bg-[#FF453A] text-white text-sm font-medium transition-all shadow-lg shadow-red-500/30"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </motion.div>

      {/* Jitsi Meet */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 relative" ref={jitsiContainerRef}>
          <iframe
            src={jitsiUrl}
            className="w-full h-full min-h-[60vh] lg:min-h-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
            style={{ border: 'none' }}
          />
        </div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[340px] bg-[#1D1D1F] text-white p-6 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10"
        >
          <h2 className="text-lg font-semibold mb-6">Consultation: {patientName}</h2>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-4">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-[#0071E3] mr-2" />
              <h4 className="font-medium text-sm">Room Details</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-white/50 text-xs mb-1">Room ID</p>
                <p className="font-mono text-sm text-white/80 break-all">{roomName}</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">Share with patient/ASHA worker</p>
                <button
                  onClick={copyRoomLink}
                  className="w-full mt-1 flex items-center justify-center space-x-2 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-sm font-medium transition-all"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-4 h-4" /><span>Link Copied!</span></>
                  ) : (
                    <><Copy className="w-4 h-4" /><span>Copy Room Link</span></>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button
              onClick={handleEndCall}
              className="w-full py-3 bg-[#FF3B30] hover:bg-[#FF453A] text-white rounded-xl text-sm font-medium transition-all"
            >
              End Call & Add Notes
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VideoCallScreen() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-lg">Loading consultation room...</div>
      </div>
    }>
      <VideoCallContent />
    </Suspense>
  );
}
