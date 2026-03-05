'use client';

import { useState } from 'react';
import { Bell, Search, Menu, X, Home, User, Users, Activity, AlertTriangle, Stethoscope, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import DefaultAvatar from './DefaultAvatar';

interface NavbarProps {
  title: string;
  userRole: 'asha' | 'doctor';
  userName?: string;
}

export default function Navbar({ title, userRole, userName }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const ashaLinks = [
    { href: '/asha/dashboard', label: 'Dashboard', icon: Home },
    { href: '/asha/profile', label: 'Profile', icon: User },
    { href: '/asha/patients', label: 'Total Patients', icon: Users },
    { href: '/asha/dashboard#ongoing-patients', label: 'Ongoing Patients', icon: Activity },
    { href: '/asha/high-risk', label: 'High Risk Alerts', icon: AlertTriangle },
    { href: '/asha/register', label: 'Register Patient', icon: UserPlus },
  ];

  const doctorLinks = [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: Home },
    { href: '/doctor/profile', label: 'Profile', icon: User },
    { href: '/doctor/dashboard#escalated', label: 'Escalated Cases', icon: AlertTriangle },
  ];

  const links = userRole === 'asha' ? ashaLinks : doctorLinks;

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-[#E5E5EA]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 -ml-2 mr-2 text-[#1D1D1F] hover:bg-black/5 rounded-full transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden md:flex relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/asha/patients?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery('');
                    }
                  }}
                  className="pl-9 pr-4 py-2 bg-black/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all w-64"
                />
              </div>

              <button className="p-2 text-[#1D1D1F] hover:bg-black/5 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF3B30] rounded-full border-2 border-white" />
              </button>

              <Link href={`/${userRole}/profile`} className="ml-2">
                <DefaultAvatar name={userName || (userRole === 'asha' ? 'ASHA Worker' : 'Doctor')} size={36} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Slide-out Menu Overlay ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div
            className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideIn 0.25s ease-out' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E5EA]/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#34C759] flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-[#1D1D1F] tracking-tight">SwasthyaSetu</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#86868B]" />
              </button>
            </div>

            {/* Role badge */}
            <div className="px-5 py-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${userRole === 'asha'
                ? 'bg-[#34C759]/10 text-[#34C759]'
                : 'bg-[#0071E3]/10 text-[#0071E3]'
                }`}>
                {userRole === 'asha' ? '🏥 ASHA Worker' : '👨‍⚕️ Doctor'}
              </span>
            </div>

            {/* Nav links */}
            <nav className="px-3 py-2">
              {links.map((link) => {
                const basePath = link.href.split('#')[0];
                const isActive = pathname === basePath && !link.href.includes('#');
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 transition-colors ${isActive
                      ? 'bg-[#0071E3]/10 text-[#0071E3] font-semibold'
                      : 'text-[#1D1D1F] hover:bg-[#F5F5F7]'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Sign out */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E5E5EA]/50">
              <button
                onClick={() => {
                  localStorage.removeItem('loggedInUser');
                  router.push('/');
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FF3B30]/10 text-[#FF3B30] rounded-2xl text-sm font-medium hover:bg-[#FF3B30]/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
