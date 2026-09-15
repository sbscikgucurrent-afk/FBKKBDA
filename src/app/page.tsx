'use client';

import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, ShieldCheck, UserCheck, HeartHandshake } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full pt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-xs sm:text-sm font-bold tracking-wide mb-6 border border-emerald-200 shadow-sm">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>FOODBANK DAPUR SISWA MADANI</span>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-xl shadow-emerald-200 ring-4 ring-white">
            <UtensilsCrossed className="w-10 h-10" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
          JOM KENYANG
        </h1>
        <p className="text-lg sm:text-xl font-medium text-emerald-800 mb-1">
          Foodbank Dapur Siswa MADANI
        </p>
        <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
          "Rekod Pengambilan Makanan Pelajar"
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="max-w-3xl mx-auto w-full my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Card */}
        <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-100/50 flex flex-col justify-between hover:border-emerald-300 transition-all card-hover">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
              <UserCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">PELAJAR</h2>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Log masuk menggunakan No. Kad Pengenalan anda untuk merekod pendaftaran pengambilan makanan dan semak sejarah pengambilan.
            </p>
          </div>
          <Link
            href="/login/student"
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center text-base shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            <span>Log Masuk Pelajar</span>
          </Link>
        </div>

        {/* Admin Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100 flex flex-col justify-between hover:border-slate-300 transition-all card-hover">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">ADMIN</h2>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Log masuk akaun pentadbir untuk mengurus senarai makanan, senarai pelajar, melihat transaksi rekod &amp; statistik laporan.
            </p>
          </div>
          <Link
            href="/login/admin"
            className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-center text-base shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <span>Log Masuk Admin</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 font-medium pb-4">
        &copy; {new Date().getFullYear()} JOM KENYANG &bull; Dapur Siswa MADANI
      </footer>
    </div>
  );
}
