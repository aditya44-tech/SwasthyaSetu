'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Video, Clock, Activity, Filter } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const mockRequests = [
  { id: 1, patient: 'Radha Devi', asha: 'Sunita Sharma', age: 32, condition: 'High Risk Pregnancy - Elevated BP', urgency: 'high', waitTime: '5 mins' },
  { id: 2, patient: 'Ramesh Kumar', asha: 'Anita Patel', age: 55, condition: 'Severe Chest Pain', urgency: 'high', waitTime: '2 mins' },
  { id: 3, patient: 'Little Aarav', asha: 'Sunita Sharma', age: 2, condition: 'High Fever & Rash', urgency: 'medium', waitTime: '15 mins' },
  { id: 4, patient: 'Kamla Bai', asha: 'Pooja Singh', age: 68, condition: 'Routine Diabetes Check', urgency: 'low', waitTime: '45 mins' },
];

export default function DoctorDashboard() {
  const router = useRouter();

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
            <p className="text-[#86868B]">You have 4 pending consultation requests.</p>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white border border-[#E5E5EA] rounded-full text-sm font-medium flex items-center hover:bg-[#F5F5F7] transition-colors apple-shadow">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="px-4 py-2 bg-[#0071E3] text-white rounded-full text-sm font-medium flex items-center hover:bg-[#0077ED] transition-colors apple-shadow">
              <Activity className="w-4 h-4 mr-2" />
              Available
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockRequests.map((request, index) => (
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
      </main>
    </div>
  );
}
