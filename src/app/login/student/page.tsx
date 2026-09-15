'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, CreditCard, ArrowLeft } from 'lucide-react';
import Toast, { ToastMessage } from '../../../components/Toast';

export default function StudentLoginPage() {
  const router = useRouter();
  const [icNumber, setIcNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!icNumber) {
      setToast({ type: 'error', message: 'Sila masukkan No. Kad Pengenalan anda.' });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icNumber, password: icNumber }),
      });

      const data = await res.json();
      if (!res.ok) {
        setToast({ type: 'error', message: data.error || 'No. Kad Pengenalan tidak wujud atau tidak tepat.' });
      } else {
        setToast({ type: 'success', message: 'Log masuk berjaya!' });
        router.push('/student/dashboard');
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Ralat rangkaian. Sila cuba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-700 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama</span>
        </Link>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Log Masuk Pelajar
        </h2>
        <p className="mt-1 text-center text-sm text-slate-600">
          JOM KENYANG &bull; Dapur Siswa MADANI
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="icNumber" className="block text-sm font-bold text-slate-700 mb-1">
                No. Kad Pengenalan
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <input
                  id="icNumber"
                  type="text"
                  required
                  placeholder="Contoh: 050101011234"
                  value={icNumber}
                  onChange={(e) => setIcNumber(e.target.value.replace(/\D/g, ''))}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium placeholder-slate-400 transition text-base"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Akaun pelajar menggunakan No. Kad Pengenalan untuk log masuk secara pantas.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-emerald-200 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <span>LOG MASUK</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-600 mb-3">
              Belum mempunyai akaun?
            </p>
            <Link
              href="/register"
              className="inline-block w-full py-3 px-4 border border-emerald-300 rounded-2xl text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition text-center"
            >
              DAFTAR AKAUN BAHARU
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
