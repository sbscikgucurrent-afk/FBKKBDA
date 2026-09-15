'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, User, CreditCard, Hash, BookOpen, Layers, Phone, ArrowLeft } from 'lucide-react';
import Toast, { ToastMessage } from '../../components/Toast';

const PROGRAM_OPTIONS = [
  'Sijil Teknologi Elektrik',
  'Sijil Teknologi Maklumat',
  'Sijil Teknologi Senibina',
  'Sijil Teknologi Automotif',
  'Diploma Teknologi Kenderaan Perdagangan',
];

export default function StudentRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    icNumber: '',
    studentId: '',
    program: PROGRAM_OPTIONS[0],
    semester: '1',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'icNumber') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    // Client-side validations
    if (
      !formData.name ||
      !formData.icNumber ||
      !formData.studentId ||
      !formData.program ||
      !formData.semester ||
      !formData.phone
    ) {
      setToast({ type: 'error', message: 'Sila isi semua maklumat yang diwajibkan.' });
      return;
    }

    if (!/^\d+$/.test(formData.icNumber)) {
      setToast({ type: 'error', message: 'No. Kad Pengenalan hanya boleh mengandungi nombor.' });
      return;
    }

    if (formData.icNumber.length < 6) {
      setToast({ type: 'error', message: 'No. Kad Pengenalan mestilah sekurang-kurangnya 6 digit.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setToast({ type: 'error', message: data.error || 'Pendaftaran gagal.' });
      } else {
        setToast({ type: 'success', message: 'Pendaftaran berjaya! Membawa anda ke halaman log masuk...' });
        setTimeout(() => {
          router.push('/login/student');
        }, 1200);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Ralat rangkaian. Sila cuba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <Link
          href="/login/student"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-700 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Log Masuk</span>
        </Link>

        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Pendaftaran Pelajar Baharu
        </h2>
        <p className="mt-1 text-center text-sm text-slate-600">
          JOM KENYANG &bull; Foodbank Dapur Siswa MADANI
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Nama Penuh */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nama Penuh</label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: SUHAILI BT SHAHBUDIN"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium placeholder-slate-400 text-sm uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* No. IC */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">No. Kad Pengenalan</label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="icNumber"
                    required
                    placeholder="12 digit nombor (Tanpa -)"
                    value={formData.icNumber}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium placeholder-slate-400 text-sm"
                  />
                </div>
              </div>

              {/* No. Matrik */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">No. Matrik</label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="studentId"
                    required
                    placeholder="Contoh: KOO1"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium placeholder-slate-400 text-sm uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Program / Kursus Dropdown */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Program / Kursus</label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <select
                    name="program"
                    required
                    value={formData.program}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium text-sm bg-white"
                  >
                    {PROGRAM_OPTIONS.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Semester</label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium text-sm bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* No. Telefon */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">No. Telefon</label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="Contoh: 0125321192"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium placeholder-slate-400 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-emerald-200 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <span>DAFTAR AKAUN</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-600">
              Sudah mempunyai akaun?{' '}
              <Link href="/login/student" className="font-bold text-emerald-700 hover:underline">
                Log Masuk Pelajar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
