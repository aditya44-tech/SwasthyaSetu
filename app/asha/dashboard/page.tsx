'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { AlertCircle, Calendar, FileText, WifiOff, ChevronRight, Stethoscope, Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const initialMockPatients = [
  { id: 1, name: 'Radha Devi', age: 32, condition: 'High Risk Pregnancy', status: 'critical', date: 'Today, 2:00 PM' },
  { id: 2, name: 'Suresh Kumar', age: 45, condition: 'Tuberculosis Follow-up', status: 'warning', date: 'Tomorrow, 10:00 AM' },
  { id: 3, name: 'Meena Singh', age: 28, condition: 'Routine Immunization', status: 'normal', date: 'Oct 15, 9:00 AM' },
];

export default function AshaDashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [patients, setPatients] = useState(initialMockPatients);

  useEffect(() => {
    const savedAlerts = localStorage.getItem('followUpAlerts');
    if (savedAlerts) {
      setTimeout(() => {
        setAlerts(JSON.parse(savedAlerts));
      }, 0);
    }
  }, []);
  return (
    <div className="min-h-screen pb-20">
      <Navbar 
        title="Overview" 
        userRole="asha" 
        profileImage="https://picsum.photos/seed/asha/200/200" 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-1">Hello, Sunita</h2>
            <p className="text-[#86868B]">Here is your schedule for today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/asha/register"
              className="flex items-center px-6 py-2.5 bg-[#0071E3] text-white rounded-full text-sm font-medium hover:bg-[#0077ED] transition-colors apple-shadow"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Register New Patient
            </Link>
            <div className="flex items-center px-3 py-1.5 bg-black/5 rounded-full text-xs font-medium text-[#86868B]">
              <WifiOff className="w-3.5 h-3.5 mr-1.5" />
              Offline Mode
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-[#FFF2F2] to-white rounded-[24px] p-6 apple-shadow border border-[#FF3B30]/10 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3B30]/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#FF3B30]" />
              </div>
              <span className="text-2xl font-semibold text-[#FF3B30]">{3 + alerts.length}</span>
            </div>
            <h3 className="font-medium text-lg mb-1">High Risk Alerts</h3>
            <p className="text-sm text-[#86868B]">Requires immediate attention</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-[24px] p-6 apple-shadow border border-[#E5E5EA]/50 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0071E3]/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#0071E3]" />
              </div>
              <span className="text-2xl font-semibold text-[#1D1D1F]">12</span>
            </div>
            <h3 className="font-medium text-lg mb-1">Follow-ups Today</h3>
            <p className="text-sm text-[#86868B]">Scheduled visits</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-[#F2FDF4] to-white rounded-[24px] p-6 apple-shadow border border-[#34C759]/10 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#34C759]/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#34C759]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#34C759]" />
              </div>
              <span className="text-2xl font-semibold text-[#34C759]">5</span>
            </div>
            <h3 className="font-medium text-lg mb-1">Scheme Alerts</h3>
            <p className="text-sm text-[#86868B]">Pending registrations</p>
          </motion.div>
        </div>


        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xl font-semibold tracking-tight flex items-center">
                <Bell className="w-5 h-5 mr-2 text-[#FF3B30]" />
                New Follow-up Alerts
              </h3>
              <button 
                onClick={() => {
                  localStorage.removeItem('followUpAlerts');
                  setAlerts([]);
                }}
                className="text-[#86868B] text-xs font-medium hover:text-[#FF3B30]"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white p-5 rounded-[24px] apple-shadow border border-[#FF3B30]/20 flex items-start space-x-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF3B30]/5 rounded-full blur-xl -mr-8 -mt-8" />
                  <div className="w-10 h-10 rounded-full bg-[#FF3B30]/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-[#FF3B30]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1D1D1F] text-sm">{alert.patientName}</h4>
                    <p className="text-xs text-[#FF3B30] font-semibold mt-0.5">{alert.riskLevel} Risk Alert</p>
                    <p className="text-[10px] text-[#86868B] mt-1">{alert.condition}</p>
                    <p className="text-[10px] text-[#86868B] mt-0.5">{alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-semibold tracking-tight">Upcoming Visits</h3>
            <button className="text-[#0071E3] text-sm font-medium hover:underline">See All</button>
          </div>
          
          <div className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden">
            {patients.map((patient, index) => (
              <div 
                key={patient.id} 
                className={`p-4 sm:p-5 flex items-center justify-between hover:bg-[#F5F5F7]/50 transition-colors cursor-pointer ${
                  index !== patients.length - 1 ? 'border-b border-[#E5E5EA]/50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center shrink-0 overflow-hidden">
                    <Image src={`https://picsum.photos/seed/patient${patient.id}/100/100`} alt={patient.name} width={48} height={48} className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1D1D1F]">{patient.name}</h4>
                    <p className="text-sm text-[#86868B] mt-0.5">{patient.condition} • {patient.age} yrs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-[#1D1D1F]">{patient.date}</p>
                    {patient.status === 'critical' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FF3B30]/10 text-[#FF3B30] mt-1">
                        High Risk
                      </span>
                    )}
                    {patient.status === 'warning' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FF9500]/10 text-[#FF9500] mt-1">
                        Follow-up
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
