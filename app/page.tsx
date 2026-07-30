'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { HeartPulse, ArrowRight, Activity, Shield, ShieldCheck, Video, Stethoscope, Languages, User, Sun } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';

const fanCards = [
  {
    rotate: -18, y: 56, gradient: 'from-[#FF3B30] to-[#FF6B5E]',
    icon: HeartPulse, label: 'ASHA Care', sub: 'Frontline heroes',
  },
  {
    rotate: -11, y: 24, gradient: 'from-[#0071E3] to-[#5AC8FA]',
    icon: Activity, label: 'AI Triage', sub: 'Instant analysis',
  },
  {
    rotate: -4, y: 4, gradient: 'from-[#FFCC00] to-[#FF9500]',
    icon: Video, label: 'Telemedicine', sub: 'Low bandwidth',
  },
  {
    rotate: 4, y: 4, gradient: 'from-[#FF2D55] to-[#AF52DE]',
    icon: Languages, label: 'Multilingual', sub: 'Hindi · Marathi',
  },
  {
    rotate: 11, y: 24, gradient: 'from-[#1D1D1F] to-[#48484A]',
    icon: ShieldCheck, label: 'Govt. Schemes', sub: 'Auto-matched',
  },
  {
    rotate: 18, y: 56, gradient: 'from-[#34C759] to-[#30D158]',
    icon: Stethoscope, label: 'Specialists', sub: 'City doctors',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#E8E8EA] overflow-x-hidden selection:bg-[#0071E3] selection:text-white font-sans p-3 sm:p-5">
      <div className="bg-[#FAFAFA] rounded-[32px] sm:rounded-[48px] shadow-sm min-h-[calc(100vh-40px)] overflow-hidden">

        {/* Navigation inside the canvas */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between px-6 sm:px-12 lg:px-20 pt-8 sm:pt-10"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#34C759] rounded-lg flex items-center justify-center">
              <HeartPulse className="text-white w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#1D1D1F]">SwasthyaSetu</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/login" className="text-sm font-medium text-[#1D1D1F] hover:opacity-60 transition-opacity">Get Started</Link>
            <a href="#features" className="text-sm font-medium text-[#1D1D1F] hover:opacity-60 transition-opacity flex items-center">
              <span className="w-2 h-2 bg-[#34C759] rounded-full mr-2" />Features
            </a>
            <a href="#impact" className="text-sm font-medium text-[#1D1D1F] hover:opacity-60 transition-opacity">Impact</a>
            <a href="#" className="text-sm font-medium text-[#1D1D1F] hover:opacity-60 transition-opacity">Contact</a>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/login" className="w-10 h-10 bg-white border border-[#E5E5EA] rounded-full flex items-center justify-center hover:shadow-md transition-all" aria-label="Sign in">
              <User className="w-4 h-4 text-[#1D1D1F]" />
            </Link>
            <button className="w-10 h-10 bg-white border border-[#E5E5EA] rounded-full hidden sm:flex items-center justify-center hover:shadow-md transition-all" aria-label="Theme">
              <Sun className="w-4 h-4 text-[#1D1D1F]" />
            </button>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center pt-16 sm:pt-20 pb-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1D1D1F] max-w-4xl leading-[1.05]"
          >
            A place to care for<br />every life.
          </motion.h1>

          {/* Fanned Card Deck */}
          <div className="relative mt-4 sm:mt-2 mb-6 w-full max-w-4xl">
            {/* Speech bubbles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute left-[8%] top-2 sm:top-6 z-30 bg-[#0071E3] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full rounded-bl-none shadow-lg -rotate-6"
            >
              @asha_worker
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="absolute right-[8%] top-2 sm:top-6 z-30 bg-[#34C759] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full rounded-br-none shadow-lg rotate-6"
            >
              @doctor
            </motion.div>

            <div className="flex justify-center items-start pt-14 sm:pt-16 pb-8">
              {fanCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 60, rotate: 0 }}
                    animate={{ opacity: 1, y: card.y, rotate: card.rotate }}
                    whileHover={{ y: card.y - 12, scale: 1.05, zIndex: 40, rotate: card.rotate * 0.5 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`relative shrink-0 w-24 h-32 sm:w-36 sm:h-48 lg:w-44 lg:h-56 -mx-3 sm:-mx-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${card.gradient} shadow-xl border-4 border-white flex flex-col items-center justify-center text-white cursor-pointer`}
                    style={{ zIndex: i < 3 ? i : 5 - i }}
                  >
                    <Icon className="w-7 h-7 sm:w-10 sm:h-10 mb-2 sm:mb-3 drop-shadow" />
                    <span className="text-[10px] sm:text-sm font-semibold tracking-tight">{card.label}</span>
                    <span className="text-[8px] sm:text-xs text-white/70 mt-0.5">{card.sub}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-[#1D1D1F]/70 max-w-md leading-relaxed mb-8"
          >
            ASHA workers can record symptoms in any language, and doctors can
            discover and treat cases that need them most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center space-x-3"
          >
            <Link href="/login" className="px-7 py-3.5 bg-[#1D1D1F] hover:bg-black text-white rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <a href="#features" className="px-7 py-3.5 bg-white text-[#1D1D1F] rounded-full text-sm font-medium border border-[#E5E5EA] hover:bg-[#F5F5F7] transition-all">
              Read more
            </a>
          </motion.div>
        </div>

      <main className="pb-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto pt-16">


        {/* Features Section */}
        <section id="features" className="scroll-mt-32 py-24 sm:py-32">
          <div className="text-center mb-16 sm:mb-20">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#34C759]/10 text-[#248A3D] text-xs font-semibold uppercase tracking-[0.18em] mb-5"
            >
              <span className="w-2 h-2 rounded-full bg-[#34C759]" />
              Care, connected
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1D1D1F]"
            >
              One platform. Every step.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-5 text-[#1D1D1F]/55 max-w-xl mx-auto leading-relaxed"
            >
              From a patient&apos;s first symptom to specialist care, SwasthyaSetu keeps every person and decision connected.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px_1fr] gap-10 lg:gap-8 items-center">
            <div className="space-y-12 order-2 lg:order-1">
              <FeatureCard
                icon={HeartPulse}
                title="ASHA-first workflow"
                description="Fast patient registration, health records, and guided field screening built for frontline care."
                align="left"
                delay={0}
              />
              <FeatureCard
                icon={Languages}
                title="Speak naturally"
                description="Record symptoms in Hindi, Marathi, or English and receive clear, structured clinical information."
                align="left"
                delay={0.1}
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Eligible schemes"
                description="Automatically match patients with relevant government health programs and support."
                align="left"
                delay={0.2}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.4 }}
              className="relative order-1 lg:order-2 mx-auto group"
            >
              <div className="absolute -inset-10 bg-gradient-to-br from-[#34C759]/20 via-[#0071E3]/10 to-[#AF52DE]/15 blur-3xl rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
              <div className="relative w-[280px] sm:w-[330px] h-[540px] sm:h-[620px] rounded-[48px] bg-[#1D1D1F] p-3 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.45)] border border-white/20">
                <div className="h-full rounded-[38px] bg-[#F8F8FA] overflow-hidden relative p-5 flex flex-col">
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#34C759]/15 to-transparent" />
                  <div className="relative flex items-center justify-between mb-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#1D1D1F]/40">Patient overview</p>
                      <p className="font-semibold text-[#1D1D1F] mt-1">Good morning, Asha</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#34C759] flex items-center justify-center">
                      <HeartPulse className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="relative bg-white rounded-[28px] p-5 shadow-sm border border-black/5 mb-4">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3] font-semibold">RK</div>
                        <div>
                          <p className="text-sm font-semibold text-[#1D1D1F]">Ravi Kumar</p>
                          <p className="text-xs text-[#1D1D1F]/45">42 years · Male</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FF9500]/10 text-[#C75B00] font-semibold">MEDIUM</span>
                    </div>
                    <div className="h-24 flex items-end gap-1.5 mb-3">
                      {[34, 48, 38, 62, 52, 78, 55, 88, 65, 74, 52, 68].map((height, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: index * 0.04 }}
                          viewport={{ once: true }}
                          className="flex-1 rounded-full bg-gradient-to-t from-[#0071E3] to-[#5AC8FA]"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-[#1D1D1F]/35">
                      <span>Heart rate trend</span><span>72 bpm</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#1D1D1F] text-white rounded-2xl p-4">
                      <Activity className="w-5 h-5 text-[#30D158] mb-5" />
                      <p className="text-[10px] text-white/50">AI analysis</p>
                      <p className="text-sm font-medium mt-1">Ready to review</p>
                    </div>
                    <div className="bg-[#34C759] text-white rounded-2xl p-4">
                      <Video className="w-5 h-5 mb-5" />
                      <p className="text-[10px] text-white/70">Doctor online</p>
                      <p className="text-sm font-medium mt-1">Connect now</p>
                    </div>
                  </div>

                  <div className="mt-auto bg-white rounded-2xl px-4 py-3 flex items-center justify-between border border-black/5">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-[#AF52DE]" />
                      <div>
                        <p className="text-xs font-medium text-[#1D1D1F]">Ayushman Bharat</p>
                        <p className="text-[10px] text-[#1D1D1F]/40">Patient is eligible</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1D1D1F]/30" />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-12 order-3">
              <FeatureCard
                icon={Activity}
                title="AI-assisted triage"
                description="Turn unstructured symptoms into risk levels, possible conditions, and actionable next steps."
                align="right"
                delay={0}
              />
              <FeatureCard
                icon={Video}
                title="Instant teleconsultation"
                description="Connect critical cases to doctors through video designed for unreliable rural networks."
                align="right"
                delay={0.1}
              />
              <FeatureCard
                icon={Shield}
                title="Private by design"
                description="Protect sensitive health records with secure access and dependable patient data handling."
                align="right"
                delay={0.2}
              />
            </div>
          </div>
        </section>

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
    </div>
  );
}
