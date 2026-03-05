'use client';

import { Bell, Search, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  title: string;
  userRole: 'asha' | 'doctor';
  profileImage: string;
}

export default function Navbar({ title, userRole, profileImage }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-[#E5E5EA]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button className="p-2 -ml-2 mr-2 text-[#1D1D1F] hover:bg-black/5 rounded-full transition-colors md:hidden">
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
                className="pl-9 pr-4 py-2 bg-black/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-all w-64"
              />
            </div>
            
            <button className="p-2 text-[#1D1D1F] hover:bg-black/5 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF3B30] rounded-full border-2 border-white" />
            </button>
            
            <Link href={`/${userRole}/profile`} className="ml-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E5E5EA] hover:opacity-80 transition-opacity">
                <Image 
                  src={profileImage} 
                  alt="Profile" 
                  width={36} 
                  height={36} 
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
