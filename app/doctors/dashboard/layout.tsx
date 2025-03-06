'use client';
import React, { ReactNode } from 'react';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DoctorsDashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic here
    router.push('/doctors');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-color1">Maisha Care</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/doctors/dashboard/profile" className="p-2 text-gray-400 hover:text-color1 rounded-full hover:bg-gray-100">
                <User className="h-6 w-6" />
              </Link>
              <div className="p-2 text-gray-400 hover:text-color1 rounded-full hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}