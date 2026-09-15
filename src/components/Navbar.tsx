'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, UtensilsCrossed, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  userName?: string;
  role?: 'STUDENT' | 'ADMIN';
}

export default function Navbar({ userName, role }: NavbarProps) {
  const router = RouterHook();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = role === 'ADMIN' ? '/login/admin' : '/login/student';
    } catch (e) {
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-emerald-800 text-lg tracking-tight leading-none">JOM KENYANG</div>
            <div className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Foodbank Dapur Siswa MADANI</div>
          </div>
        </Link>

        {userName && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <UserIcon className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-700">{userName}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 uppercase">
                {role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-2 rounded-xl transition"
              title="Log Masuk / Log Keluar"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Keluar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function RouterHook() {
  try {
    return useRouter();
  } catch {
    return null;
  }
}
