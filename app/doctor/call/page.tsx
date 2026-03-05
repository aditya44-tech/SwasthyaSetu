'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { PhoneOff, Copy, CheckCircle2, ExternalLink, Users, Share2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function VideoCallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [roomName] = useState(() => {
    const param = searchParams.get('room');
    if (param) return param;
    // Generate a unique room name
    const id = Math.random().toString(36).substring(2, 10);
    return `rural-ai-doctor-${id}`;
  });
  const [copied, setCopied] = useState(false);
  const [callActive, setCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Call timer
  useEffect(() => {
    if (!callActive) return;
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEndCall = () => {
    setCallActive(false);
    router.push('/doctor/dashboard');
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/doctor/call?room=${roomName}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.disableDeepLinking=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_BRAND_WATERMARK=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","chat","raisehand","tileview","hangup","fullscreen"]`;

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
            <span className="text-white text-sm font-medium">Live Consultation</span>
          </div>
          <span className="text-white/40 text-sm font-mono">{formatTime(callDuration)}</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Share Room Link */}
          <button
            onClick={copyRoomLink}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                <span className="text-[#34C759]">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share Link</span>
              </>
            )}
          </button>

          {/* Open in new tab */}
          <a
            href={`https://meet.jit.si/${roomName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open External</span>
          </a>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="flex items-center space-x-2 px-5 py-2 rounded-full bg-[#FF3B30] hover:bg-[#FF453A] text-white text-sm font-medium transition-all shadow-lg shadow-red-500/30"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </motion.div>

      {/* Jitsi Meet Container */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Video Area */}
        <div className="flex-1 relative" ref={jitsiContainerRef}>
          <iframe
            src={jitsiUrl}
            className="w-full h-full min-h-[60vh] lg:min-h-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
            style={{ border: 'none' }}
          />
        </div>

        {/* Side Panel — Room Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[340px] bg-[#1D1D1F] text-white p-6 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10"
        >
          <h2 className="text-lg font-semibold mb-6">Consultation Room</h2>

          {/* Room Info */}
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
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Room Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-4">
            <h4 className="font-medium text-sm mb-3">How it works</h4>
            <ol className="space-y-2 text-sm text-white/70">
              <li className="flex items-start">
                <span className="w-5 h-5 bg-[#0071E3] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 shrink-0 mt-0.5">1</span>
                Click &quot;Copy Room Link&quot; above
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-[#0071E3] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 shrink-0 mt-0.5">2</span>
                Share the link with the ASHA worker via WhatsApp or SMS
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-[#0071E3] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 shrink-0 mt-0.5">3</span>
                Both sides join automatically — no app install needed
              </li>
            </ol>
          </div>

          {/* Quick Actions */}
          <div className="mt-auto space-y-3">
            <button
              onClick={() => router.push('/doctor/dashboard')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all"
            >
              Back to Dashboard
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
