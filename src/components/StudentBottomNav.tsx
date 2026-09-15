'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Utensils, History, User } from 'lucide-react';

export default function StudentBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/student/dashboard', label: 'Utama', icon: LayoutDashboard },
    { href: '/student/pickup', label: 'Ambil Makanan', icon: Utensils },
    { href: '/student/history', label: 'Sejarah', icon: History },
    { href: '/student/profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-700 font-bold bg-emerald-50'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
