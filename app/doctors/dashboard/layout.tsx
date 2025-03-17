'use client';
import React, { ReactNode } from 'react';
import { LogOut, User, Home, FileText, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ErrorBoundary from '../../../components/ErrorBoundary';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DoctorsDashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Handle logout logic here
    router.push('/doctors');
  };

  // Navigation links for the doctor's dashboard
  const navLinks = [
    { name: 'Dashboard', href: '/doctors/dashboard', icon: Home },
    { name: 'Cases', href: '/doctors/dashboard', icon: FileText },
    { name: 'Patients', href: '/doctors/dashboard/patients', icon: Users },
    { name: 'Settings', href: '/doctors/dashboard/settings', icon: Settings },
  ];

  // Check if a link is active
  const isActive = (path: string) => {
    if (path === '/doctors/dashboard' && pathname === '/doctors/dashboard') {
      return true;
    }
    return pathname.startsWith(path) && path !== '/doctors/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/doctors/dashboard" className="text-xl font-bold text-color1">
                  Maisha Care
                </Link>
              </div>
              {/* Desktop navigation */}
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                        isActive(link.href)
                          ? 'bg-color1/10 text-color1'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-color1'
                      }`}
                    >
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.name}
                    </Link>
                  ))}
                </div>
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
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}