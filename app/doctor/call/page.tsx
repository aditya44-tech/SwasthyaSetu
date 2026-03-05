'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2, FileText, Activity } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function VideoCallScreen() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEndCall = () => {
    router.push('/doctor/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden">
      {/* Main Video Area */}
      <div className="flex-1 relative p-4 flex flex-col">
        <div className="absolute top-8 left-8 z-10 glass-dark px-4 py-2 rounded-full flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium tracking-wider">{formatTime(callDuration)}</span>
        </div>

        {/* Remote Video (Patient/ASHA) */}
        <div className="flex-1 w-full h-full relative rounded-[32px] overflow-hidden bg-[#1D1D1F]">
          <Image 
            src="https://picsum.photos/seed/patient_video/1280/720" 
            alt="Patient Video" 
            fill
            className="object-cover"
          />
          <div className="absolute bottom-6 left-6 glass-dark px-4 py-2 rounded-2xl">
            <p className="text-white font-medium text-sm">Radha Devi & Sunita (ASHA)</p>
          </div>
        </div>

        {/* Local Video (Doctor) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-8 right-8 w-32 md:w-48 aspect-[3/4] rounded-[24px] overflow-hidden border-2 border-white/20 shadow-2xl z-10 bg-[#1D1D1F]"
        >
          <Image 
            src="https://picsum.photos/seed/doctor_video/400/600" 
            alt="My Video" 
            fill
            className={`object-cover transition-opacity duration-300 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center">
                <VideoOff className="w-6 h-6 md:w-8 md:h-8 text-white/50" />
              </div>
            </div>
          )}
        </motion.div>

        {/* Floating Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="glass-dark px-6 py-4 rounded-full flex items-center space-x-4 md:space-x-6 shadow-2xl border border-white/10">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                isVideoOff ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <Video className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            
            <button 
              onClick={handleEndCall}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#FF3B30] hover:bg-[#FF453A] text-white flex items-center justify-center transition-all shadow-lg shadow-red-500/20"
            >
              <PhoneOff className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel (Patient Info) */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[400px] bg-[#1D1D1F] text-white p-6 flex flex-col border-t md:border-t-0 md:border-l border-white/10"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">Patient Details</h2>
          <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 shrink-0">
            <Image src="https://picsum.photos/seed/patient1/100/100" alt="Patient" width={64} height={64} className="object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Radha Devi</h3>
            <p className="text-white/60 text-sm">32 yrs • Female</p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="bg-white/5 rounded-[20px] p-5 border border-white/5">
            <div className="flex items-center mb-3">
              <Activity className="w-5 h-5 text-[#FF3B30] mr-2" />
              <h4 className="font-medium">Current Vitals</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/50 text-xs mb-1">Blood Pressure</p>
                <p className="font-semibold text-lg text-[#FF3B30]">145/95</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">Heart Rate</p>
                <p className="font-semibold text-lg">88 bpm</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">Temperature</p>
                <p className="font-semibold text-lg">98.6°F</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">SpO2</p>
                <p className="font-semibold text-lg">98%</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-[20px] p-5 border border-white/5">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-[#0071E3] mr-2" />
              <h4 className="font-medium">ASHA Notes</h4>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Patient complaining of severe headache and blurry vision since morning. BP elevated compared to last week&apos;s reading (130/85). Swelling in ankles observed.
            </p>
          </div>
        </div>

        <button className="w-full py-4 bg-white text-black rounded-2xl font-medium mt-6 hover:bg-white/90 transition-colors">
          Write Prescription
        </button>
      </motion.div>
    </div>
  );
}
