'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Utensils,
  Users,
  ClipboardList,
  BarChart3,
  Download,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/foods', label: 'Pengurusan Stok', icon: Utensils },
    { href: '/admin/students', label: 'Senarai Pelajar', icon: Users },
    { href: '/admin/pickups', label: 'Rekod Pengambilan', icon: ClipboardList },
    { href: '/admin/statistics', label: 'Statistik', icon: BarChart3 },
    { href: '/admin/export', label: 'Export Data', icon: Download },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login/admin';
    }
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          MENU PENTADBIR
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-100 mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-sm transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Keluar</span>
        </button>
      </div>
    </aside>
  );
}
