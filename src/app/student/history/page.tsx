'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import StudentBottomNav from '../../../components/StudentBottomNav';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { Calendar, Filter, ArrowLeft, Utensils, Clock } from 'lucide-react';

interface PickupRecord {
  id: string;
  pickupDate: string;
  pickupTime: string;
  items: { id: string; foodName: string }[];
}

export default function StudentHistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [pickups, setPickups] = useState<PickupRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(currentDate.getMonth() + 1)
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    String(currentDate.getFullYear())
  );

  const monthsList = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Mac' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Jun' },
    { value: '7', label: 'Julai' },
    { value: '8', label: 'Ogos' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Disember' },
  ];

  const yearsList = ['2024', '2025', '2026', '2027'];

  const fetchHistory = async (month: string, year: string) => {
    setLoading(true);
    try {
      let url = '/api/student/pickups';
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPickups(data.pickups || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          window.location.href = '/login/student';
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);
        await fetchHistory(selectedMonth, selectedYear);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  const handleFilterChange = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(selectedMonth, selectedYear);
  };

  const resetFilter = () => {
    setSelectedMonth('');
    setSelectedYear('');
    fetchHistory('', '');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <Navbar userName={user?.name} role="STUDENT" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              📜 Sejarah Pengambilan
            </h1>
            <p className="text-slate-600 text-sm">
              Rekod pengambilan makanan diri anda sahaja.
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 self-start sm:self-auto">
            <Utensils className="w-4 h-4 text-emerald-600" />
            <span>Jumlah Pengambilan Saya: {totalCount} kali</span>
          </div>
        </div>

        {/* Filter Section */}
        <form onSubmit={handleFilterChange} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Tapis Rekod:</span>
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Semua Bulan</option>
            {monthsList.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Semua Tahun</option>
            {yearsList.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition"
          >
            Tapis
          </button>

          {(selectedMonth || selectedYear) && (
            <button
              type="button"
              onClick={resetFilter}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold underline px-2"
            >
              Set Semula
            </button>
          )}
        </form>

        {/* History List */}
        {loading ? (
          <LoadingSpinner text="Memuatkan sejarah..." />
        ) : pickups.length === 0 ? (
          <EmptyState
            title="Belum ada rekod pengambilan."
            description="Pengambilan makanan anda akan dipaparkan di sini."
          />
        ) : (
          <div className="space-y-4">
            {pickups.map((p) => {
              const pDate = new Date(p.pickupDate);
              const formattedDate = pDate.toLocaleDateString('ms-MY', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });

              return (
                <div key={p.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-2">
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.pickupTime}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Makanan Diambil:</div>
                    <div className="flex flex-wrap gap-2">
                      {p.items.map((item) => (
                        <span
                          key={item.id}
                          className="bg-emerald-50 text-emerald-800 font-bold text-sm px-3.5 py-1.5 rounded-xl border border-emerald-100"
                        >
                          {item.foodName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <StudentBottomNav />
    </div>
  );
}
