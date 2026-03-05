'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { HeartPulse, ArrowRight, Menu, Activity, Shield, Wifi, Video } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] overflow-x-hidden selection:bg-[#0071E3] selection:text-white font-sans">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg rounded-full px-6 py-3 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#34C759] rounded-full flex items-center justify-center">
              <HeartPulse className="text-white w-5 h-5" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-[#1D1D1F]">SwasthyaSetu</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-xs font-medium text-[#1D1D1F] hover:text-[#0071E3] transition-colors">Overview</Link>
            <a href="#features" className="text-xs font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors">Features</a>
            <a href="#impact" className="text-xs font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors">Impact</a>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/login" className="px-4 py-1.5 bg-[#1D1D1F] text-white text-xs font-medium rounded-full hover:bg-black transition-colors">
              Sign In
            </Link>
          </div>
        </motion.div>
      </nav>

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="px-3 py-1 rounded-full border border-[#0071E3]/30 bg-[#0071E3]/5 text-[#0071E3] text-[10px] font-bold uppercase tracking-widest">
              New Standard
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-[#1D1D1F] mb-6 max-w-4xl"
          >
            Healthcare.<br />
            <span className="text-[#86868B]">Reimagined.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-[#86868B] max-w-xl leading-relaxed mb-10"
          >
            Connecting rural communities with world-class medical expertise through AI-powered diagnostics and seamless teleconsultation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center space-x-4"
          >
            <Link href="/login" className="px-8 py-3 bg-[#34C759] hover:bg-[#2FB350] text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/25 flex items-center">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <button className="px-8 py-3 bg-white text-[#1D1D1F] rounded-full font-medium border border-[#E5E5EA] hover:bg-[#F5F5F7] transition-all">
              Learn more
            </button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px] md:auto-rows-[450px] scroll-mt-32">

          {/* Card 1: ASHA Workers (Large) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2 bg-white rounded-[40px] p-8 md:p-12 relative overflow-hidden group border border-[#E5E5EA]/50 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-center"
          >
            <div className="relative z-10 max-w-xl">
              <div className="w-16 h-16 bg-[#FF3B30]/10 rounded-2xl flex items-center justify-center mb-6">
                <HeartPulse className="w-8 h-8 text-[#FF3B30]" />
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold text-[#1D1D1F] mb-4">Empowering ASHA Workers</h3>
              <p className="text-lg text-[#86868B]">Advanced tools for frontline heroes. AI-assisted triage, digital health records, and instant specialist connection right from the field.</p>
            </div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-[#FF3B30]/5 to-transparent rounded-full blur-3xl" />
          </motion.div>

          {/* Card 2: AI Analysis (Tall) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:row-span-2 bg-[#1D1D1F] text-white rounded-[40px] p-8 md:p-12 relative overflow-hidden group shadow-2xl flex flex-col justify-center"
          >
            <div className="relative z-20">
              <div className="w-16 h-16 bg-white/10 shrink-0 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">AI Diagnostics</h3>
              <p className="text-lg text-white/70 leading-relaxed">Instant symptom analysis and risk prediction powered by Gemini models, capable of understanding multiple languages including Hindi and Marathi.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0071E3]/20 to-transparent rounded-full blur-3xl mix-blend-screen" />
          </motion.div>

          {/* Card 3: Teleconsultation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F5F5F7] rounded-[40px] p-8 md:p-12 relative overflow-hidden group border border-[#E5E5EA] hover:bg-white transition-colors duration-500 flex flex-col justify-center"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#34C759]/10 rounded-2xl flex items-center justify-center mb-6">
                <Video className="w-8 h-8 text-[#34C759]" />
              </div>
              <h3 className="text-3xl font-semibold text-[#1D1D1F] mb-4">Teleconsultation</h3>
              <p className="text-lg text-[#86868B]">Crystal clear video calls optimized for low-bandwidth rural networks.</p>
            </div>
          </motion.div>

          {/* Card 4: Offline Mode */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F5F5F7] rounded-[40px] p-8 md:p-12 relative overflow-hidden group border border-[#E5E5EA] hover:bg-white transition-colors duration-500 flex flex-col justify-center"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#FF9500]/10 rounded-2xl flex items-center justify-center mb-6">
                <Wifi className="w-8 h-8 text-[#FF9500]" />
              </div>
              <h3 className="text-3xl font-semibold text-[#1D1D1F] mb-4">Offline First</h3>
              <p className="text-lg text-[#86868B]">No internet? No problem. Full diagnosis works completely offline.</p>
            </div>
          </motion.div>

          {/* Card 5: Security */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-3 bg-[#34C759] text-white rounded-[40px] p-8 md:p-12 relative overflow-hidden group flex flex-col justify-center min-h-[400px]"
          >
            <div className="relative z-10 max-w-xl">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold mb-4">Enterprise Grade Security</h3>
              <p className="text-lg text-white/80">End-to-end encryption for all patient data. Fully compliant with global healthcare data standards ensuring privacy.</p>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 mix-blend-screen" />
          </motion.div>

        </div>

        {/* Impact Section */}
        <div id="impact" className="mt-32 mb-24 scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F] mb-4">Our Impact</h2>
            <p className="text-[#86868B] text-lg max-w-2xl mx-auto">Transforming healthcare accessibility across rural India.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-[32px] border border-[#E5E5EA]/50 text-center shadow-sm"
            >
              <div className="text-5xl font-bold text-[#0071E3] mb-2">50k+</div>
              <div className="text-[#1D1D1F] font-semibold mb-2">Patients Diagnosed</div>
              <p className="text-sm text-[#86868B]">Accurate AI-driven initial symptom assessments.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-[#E5E5EA]/50 text-center shadow-sm"
            >
              <div className="text-5xl font-bold text-[#34C759] mb-2">1,200</div>
              <div className="text-[#1D1D1F] font-semibold mb-2">ASHA Workers</div>
              <p className="text-sm text-[#86868B]">Empowered with digital tools and AI assistants.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-[32px] border border-[#E5E5EA]/50 text-center shadow-sm"
            >
              <div className="text-5xl font-bold text-[#FF9500] mb-2">150+</div>
              <div className="text-[#1D1D1F] font-semibold mb-2">Remote Villages</div>
              <p className="text-sm text-[#86868B]">Connected to specialized city doctors.</p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 border-t border-[#E5E5EA] pt-12 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-[#34C759] rounded-full flex items-center justify-center">
                <HeartPulse className="text-white w-3 h-3" />
              </div>
              <span className="font-semibold text-sm text-[#1D1D1F]">SwasthyaSetu Platform</span>
            </div>
            <div className="flex space-x-6 text-xs text-[#86868B]">
              <a href="#" className="hover:text-[#1D1D1F] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1D1D1F] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#1D1D1F] transition-colors">Contact Support</a>
            </div>
          </div>
          <p className="text-center text-[10px] text-[#86868B] mt-8">
            © 2024 SwasthyaSetu Platform. All rights reserved. Designed with care.
          </p>
        </footer>
      </main>
    </div>
  );
}
