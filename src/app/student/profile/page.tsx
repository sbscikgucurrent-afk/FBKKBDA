'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import StudentBottomNav from '../../../components/StudentBottomNav';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { User, CreditCard, Hash, BookOpen, Layers, Phone, ArrowLeft, ShieldCheck } from 'lucide-react';
import { maskIC } from '../../../lib/utils';

export default function StudentProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          window.location.href = '/login/student';
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Memuatkan profil..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <Navbar userName={user?.name} role="STUDENT" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-100 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl shadow-inner">
              {user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Pelajar Berdaftar
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>No. Kad Pengenalan</span>
              </div>
              <div className="text-base font-bold text-slate-800">
                {maskIC(user?.icNumber || '')}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Hash className="w-4 h-4 text-emerald-600" />
                <span>No. Matrik</span>
              </div>
              <div className="text-base font-bold text-slate-800 uppercase">
                {user?.studentId}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Program</span>
              </div>
              <div className="text-base font-bold text-slate-800">
                {user?.program}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Semester</span>
              </div>
              <div className="text-base font-bold text-slate-800">
                Semester {user?.semester}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 sm:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>No. Telefon</span>
              </div>
              <div className="text-base font-bold text-slate-800">
                {user?.phone}
              </div>
            </div>
          </div>
        </div>
      </main>

      <StudentBottomNav />
    </div>
  );
}
