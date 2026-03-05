'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { User, Calendar, Phone, MapPin, Baby, ArrowRight, ChevronLeft } from 'lucide-react';

export default function RegisterPatient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Female',
    phoneNumber: '',
    address: '',
    pregnancyStatus: 'Not Pregnant'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to "database" (localStorage for this demo)
    const patientData = {
      ...formData,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentPatient', JSON.stringify(patientData));
    
    // Redirect to Symptom Checker
    router.push('/asha/symptoms');
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar 
        title="Patient Registration" 
        userRole="asha" 
        profileImage="https://picsum.photos/seed/asha/200/200" 
      />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-[#86868B] hover:text-[#1D1D1F] mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[32px] p-8 apple-shadow border border-[#E5E5EA]/50"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">New Registration</h2>
            <p className="text-[#86868B] mt-1">Enter patient details to begin AI symptom analysis.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1D1D1F] flex items-center">
                  <User className="w-4 h-4 mr-2 text-[#0071E3]" />
                  Full Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="e.g. Radha Devi"
                  className="w-full px-5 py-4 bg-[#F5F5F7] border-none rounded-2xl focus:ring-2 focus:ring-[#0071E3]/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1D1D1F] flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[#0071E3]" />
                    Age
                  </label>
                  <input 
                    type="number" 
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Years"
                    className="w-full px-5 py-4 bg-[#F5F5F7] border-none rounded-2xl focus:ring-2 focus:ring-[#0071E3]/30 transition-all"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1D1D1F] flex items-center">
                    <User className="w-4 h-4 mr-2 text-[#0071E3]" />
                    Gender
                  </label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-5 py-4 bg-[#F5F5F7] border-none rounded-2xl focus:ring-2 focus:ring-[#0071E3]/30 transition-all appearance-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Conditional Pregnancy Field */}
              {formData.gender === 'Female' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-[#1D1D1F] flex items-center">
                    <Baby className="w-4 h-4 mr-2 text-[#FF3B30]" />
                    Pregnancy Status
                  </label>
                  <div className="flex p-1 bg-[#F5F5F7] rounded-2xl">
                    {['Pregnant', 'Not Pregnant', 'Unknown'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData({...formData, pregnancyStatus: status})}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                          formData.pregnancyStatus === status 
                            ? 'bg-white text-[#1D1D1F] shadow-sm' 
                            : 'text-[#86868B] hover:text-[#1D1D1F]'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1D1D1F] flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-[#0071E3]" />
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-5 py-4 bg-[#F5F5F7] border-none rounded-2xl focus:ring-2 focus:ring-[#0071E3]/30 transition-all"
                />
              </div>

              {/* Village / Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1D1D1F] flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-[#0071E3]" />
                  Village / Address
                </label>
                <textarea 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter village name or full address"
                  className="w-full px-5 py-4 bg-[#F5F5F7] border-none rounded-2xl focus:ring-2 focus:ring-[#0071E3]/30 transition-all h-24 resize-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white py-4 rounded-2xl font-semibold transition-all flex items-center justify-center group shadow-xl shadow-blue-500/20"
            >
              Register & Start Analysis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
