'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { AlertCircle, Calendar, ChevronRight, Bell, UserPlus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AshaDashboard() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('ASHA Worker');


  useEffect(() => {
    // Load user name from session
    const saved = localStorage.getItem('loggedInUser');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setUserName(user.name?.split(' ')[0] || 'ASHA Worker');
      } catch { /* ignore */ }
    }

    const loadData = async () => {
      try {
        const [alertsRes, patientsRes, casesRes] = await Promise.all([
          fetch('/api/alerts'),
          fetch('/api/patients'),
          fetch('/api/cases')
        ]);

        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData.alerts || []);
        }

        // Build a map of patient name -> status from escalated cases
        const statusMap: Record<string, string> = {};
        if (casesRes.ok) {
          const casesData = await casesRes.json();
          (casesData.cases || []).forEach((c: any) => {
            const name = c.patient?.fullName;
            if (name) {
              const level = c.analysis?.triage_level;
              if (c.status === 'resolved') {
                statusMap[name] = 'recovered';
              } else if (level === 'High' || level === 'Critical') {
                statusMap[name] = 'needs_doctor';
              } else {
                statusMap[name] = 'monitoring';
              }
            }
          });
        }

        if (patientsRes.ok) {
          const patientsData = await patientsRes.json();
          const formattedPatients = (patientsData.patients || []).map((p: any) => {
            // Determine health status
            let healthStatus = statusMap[p.name] || 'none';
            return {
              id: p.id,
              name: p.name,
              age: p.age,
              gender: p.gender,
              phoneNumber: p.phoneNumber,
              address: p.address,
              pregnancyStatus: p.pregnancyStatus,
              condition: p.pregnancyStatus !== 'Not Pregnant' && p.pregnancyStatus ? p.pregnancyStatus : 'Routine Checkup',
              healthStatus,
              date: p.date
            };
          });
          setPatients(formattedPatients);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const clearAlerts = async () => {
    try {
      const res = await fetch('/api/alerts', { method: 'DELETE' });
      if (res.ok) setAlerts([]);
    } catch (error) {
      console.error('Failed to clear alerts:', error);
    }
  };

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
            <h2 className="text-3xl font-semibold tracking-tight mb-1">Hello, {userName}</h2>
            <p className="text-[#86868B]">Here is your schedule for today.</p>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* High Risk Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => router.push('/asha/high-risk')}
            className="bg-gradient-to-br from-[#FFF2F2] to-white rounded-[24px] p-6 apple-shadow border border-[#FF3B30]/10 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3B30]/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#FF3B30]" />
              </div>
              <span className="text-2xl font-semibold text-[#FF3B30]">{patients.filter(p => p.healthStatus === 'needs_doctor').length}</span>
            </div>
            <h3 className="font-medium text-lg mb-1">High Risk Alerts</h3>
            <p className="text-sm text-[#86868B]">Requires immediate attention</p>
          </motion.div>

          {/* Total Patients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => router.push('/asha/patients')}
            className="bg-white rounded-[24px] p-6 apple-shadow border border-[#E5E5EA]/50 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0071E3]/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#0071E3]" />
              </div>
              <span className="text-2xl font-semibold text-[#1D1D1F]">{patients.length}</span>
            </div>
            <h3 className="font-medium text-lg mb-1">Total Patients</h3>
            <p className="text-sm text-[#86868B]">Registered patients</p>
          </motion.div>

          {/* Add New Patient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => router.push('/asha/register')}
            className="bg-gradient-to-br from-[#EAF4FF] to-white rounded-[24px] p-6 apple-shadow border border-[#0071E3]/10 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0071E3]/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-[#0071E3]" />
              </div>
              <ChevronRight className="w-5 h-5 text-[#0071E3] group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-lg mb-1">Add New Patient</h3>
            <p className="text-sm text-[#86868B]">Register & run diagnosis</p>
          </motion.div>
        </div>

        {/* ── Alerts Section ── */}
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
                onClick={clearAlerts}
                className="text-[#86868B] text-xs font-medium hover:text-[#FF3B30] transition-colors"
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

        {/* ── Ongoing Patients ── */}
        <motion.div
          id="ongoing-patients"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-semibold tracking-tight">Ongoing Patients</h3>
          </div>

          <div className="bg-white rounded-[24px] apple-shadow border border-[#E5E5EA]/50 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-[#86868B]">Loading patient data...</div>
            ) : patients.filter(p => p.healthStatus !== 'recovered' && p.healthStatus !== 'none').length === 0 ? (
              <div className="p-8 text-center text-[#86868B]">No ongoing patients. All patients have been cleared.</div>
            ) : (
              patients.filter(p => p.healthStatus !== 'recovered' && p.healthStatus !== 'none').map((patient, index, arr) => (
                <div
                  key={patient.id}
                  onClick={() => router.push(`/patient/profile?id=${patient.id}`)}
                  className={`p-4 sm:p-5 flex items-center justify-between hover:bg-[#F5F5F7]/50 transition-colors cursor-pointer ${index !== arr.length - 1 ? 'border-b border-[#E5E5EA]/50' : ''
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
                  <div className="flex items-center space-x-3">
                    {patient.healthStatus === 'needs_doctor' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF3B30]/10 text-[#FF3B30]">
                        🔴 Needs Doctor
                      </span>
                    )}
                    {patient.healthStatus === 'monitoring' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF9500]/10 text-[#FF9500]">
                        🟡 Monitoring
                      </span>
                    )}
                    {patient.healthStatus === 'recovered' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#34C759]/10 text-[#34C759]">
                        🟢 Recovered
                      </span>
                    )}
                    {patient.healthStatus === 'none' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/5 text-[#86868B]">
                        ⚪ New
                      </span>
                    )}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-[#1D1D1F]">{patient.date}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
