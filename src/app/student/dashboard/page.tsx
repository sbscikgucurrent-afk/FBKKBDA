'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import StudentBottomNav from '../../../components/StudentBottomNav';
import { Utensils, History, ArrowRight, Calendar, User, Sparkles } from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function StudentDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [totalPickups, setTotalPickups] = useState<number>(0);
  const [lastPickupStr, setLastPickupStr] = useState<string>('Tiada rekod');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          window.location.href = '/login/student';
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        const pickupRes = await fetch('/api/student/pickups');
        if (pickupRes.ok) {
          const pData = await pickupRes.json();
          setTotalPickups(pData.totalCount || 0);

          if (pData.lastPickup) {
            const pDate = new Date(pData.lastPickup.pickupDate);
            const dateFormatted = pDate.toLocaleDateString('ms-MY', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            setLastPickupStr(`${dateFormatted}, ${pData.lastPickup.pickupTime}`);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Memuatkan Dashboard Pelajar..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <Navbar userName={user?.name} role="STUDENT" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-200/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none">
            <Utensils className="w-48 h-48" />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dapur Siswa MADANI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {user?.name}
            </h1>

            {/* Profile Summary Card */}
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-emerald-100 block text-[11px] uppercase tracking-wider">No. Matrik</span>
                <span className="font-bold">{user?.studentId}</span>
              </div>
              <div>
                <span className="text-emerald-100 block text-[11px] uppercase tracking-wider">Program</span>
                <span className="font-bold truncate block" title={user?.program}>{user?.program}</span>
              </div>
              <div>
                <span className="text-emerald-100 block text-[11px] uppercase tracking-wider">Semester</span>
                <span className="font-bold">Semester {user?.semester}</span>
              </div>
              <div>
                <span className="text-emerald-100 block text-[11px] uppercase tracking-wider">Jumlah Pengambilan</span>
                <span className="font-bold text-amber-200">{totalPickups} kali</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jumlah Pengambilan Saya</div>
              <div className="text-3xl font-black text-emerald-700 mt-1">{totalPickups} <span className="text-sm font-semibold text-slate-500">kali</span></div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengambilan Terakhir</div>
              <div className="text-sm font-bold text-slate-700 mt-1">{lastPickupStr}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Card 1: Ambil Makanan */}
          <Link
            href="/student/pickup"
            className="group bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-xl shadow-emerald-100 flex flex-col justify-between hover:bg-emerald-50/50 transition-all card-hover"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🍪</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition">
                AMBIL MAKANAN
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pilih dan rekod makanan yang anda ambil dari Foodbank Dapur Siswa hari ini.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between font-bold text-emerald-700 text-sm">
              <span>Mula Rekod</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Sejarah Pengambilan */}
          <Link
            href="/student/history"
            className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-lg shadow-slate-100 flex flex-col justify-between hover:border-slate-300 transition-all card-hover"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📜</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-slate-700 transition">
                SEJARAH PENGAMBILAN
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Semak rekod pengambilan terdahulu mengikut tarikh dan masa.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between font-bold text-slate-600 text-sm">
              <span>Lihat Sejarah</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      <StudentBottomNav />
    </div>
  );
}
