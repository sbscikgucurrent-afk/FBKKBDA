'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import StudentBottomNav from '../../../components/StudentBottomNav';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Toast, { ToastMessage } from '../../../components/Toast';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { Utensils, CheckCircle2, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | null;
}

interface SuccessData {
  date: string;
  time: string;
  items: string[];
}

export default function StudentPickupPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          window.location.href = '/login/student';
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        const foodsRes = await fetch('/api/student/foods');
        if (foodsRes.ok) {
          const fData = await foodsRes.json();
          setFoods(fData.foods || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleFoodSelection = (id: string) => {
    setSelectedFoodIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePreSave = () => {
    if (selectedFoodIds.length === 0) {
      setToast({
        type: 'error',
        message: 'Sila pilih sekurang-kurangnya satu makanan.',
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    setToast(null);

    try {
      const res = await fetch('/api/student/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodIds: selectedFoodIds }),
      });

      const data = await res.json();
      if (!res.ok) {
        setToast({ type: 'error', message: data.error || 'Gagal menyimpan pengambilan.' });
        setSubmitting(false);
      } else {
        const pDate = new Date(data.pickup.pickupDate);
        const formattedDate = pDate.toLocaleDateString('ms-MY', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        const selectedNames = foods
          .filter((f) => selectedFoodIds.includes(f.id))
          .map((f) => f.name);

        setSuccessData({
          date: formattedDate,
          time: data.pickup.pickupTime,
          items: selectedNames,
        });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Ralat rangkaian. Sila cuba lagi.' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Memuatkan senarai makanan..." />
      </div>
    );
  }

  // Success Screen
  if (successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
        <Navbar userName={user?.name} role="STUDENT" />

        <div className="max-w-md mx-auto w-full bg-white rounded-3xl p-8 shadow-2xl border border-emerald-100 text-center my-auto space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pengambilan Berjaya Direkodkan!
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Terima kasih. Rekod anda telah disimpan secara rasmi.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Tarikh:</span>
              <span className="font-bold text-slate-800">{successData.date}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Masa:</span>
              <span className="font-bold text-slate-800">{successData.time}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium text-xs uppercase tracking-wider block mb-2">
                Makanan Diambil:
              </span>
              <ul className="space-y-2">
                {successData.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/student/dashboard"
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all block"
          >
            KEMBALI KE DASHBOARD
          </Link>
        </div>

        <StudentBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-8">
      <Navbar userName={user?.name} role="STUDENT" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmDialog
        isOpen={showConfirm}
        title="Pengesahan Pengambilan"
        message="Anda pasti mahu merekod pengambilan makanan yang dipilih ini?"
        confirmLabel="YA, SIMPAN"
        cancelLabel="BATAL"
        isLoading={submitting}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            {selectedFoodIds.length} Makanan Dipilih
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>🍪 AMBIL MAKANAN</span>
          </h1>
          <p className="text-slate-600 text-sm">
            Pilihan makanan yang anda ambil di Dapur Siswa hari ini.
          </p>
        </div>

        {foods.length === 0 ? (
          <EmptyState
            title="Tiada Makanan Tersedia"
            description="Tiada item makanan berstatus aktif buat masa ini. Sila semak semula kemudian."
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {foods.map((food) => {
                const isChecked = selectedFoodIds.includes(food.id);
                return (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => toggleFoodSelection(food.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between select-none active:scale-[0.99] ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50/90 shadow-md shadow-emerald-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 transition-colors ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>

                      {food.imageUrl ? (
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                          <Utensils className="w-5 h-5" />
                        </div>
                      )}

                      <div>
                        <div className={`font-bold text-base ${isChecked ? 'text-emerald-900' : 'text-slate-800'}`}>
                          {food.name}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">Kategori: {food.category}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 sticky bottom-16 md:relative md:bottom-0 bg-slate-50/90 backdrop-blur-sm p-2 rounded-2xl">
              <button
                type="button"
                onClick={handlePreSave}
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                <span>SIMPAN PENGAMBILAN</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <StudentBottomNav />
    </div>
  );
}
