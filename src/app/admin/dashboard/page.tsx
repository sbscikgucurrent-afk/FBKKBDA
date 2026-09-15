'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../../../components/AdminSidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { Users, Calendar, Utensils, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentPickups, setRecentPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          window.location.href = '/login/admin';
          return;
        }
        const meData = await meRes.json();
        if (meData.user?.role !== 'ADMIN') {
          window.location.href = '/student/dashboard';
          return;
        }
        setUser(meData.user);

        const dashRes = await fetch('/api/admin/dashboard');
        if (dashRes.ok) {
          const dData = await dashRes.json();
          setStats(dData.stats);
          setRecentPickups(dData.recentPickups || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Memuatkan Dashboard Pentadbir..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar userName={user?.name} role="ADMIN" />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dashboard Pentadbir
              </h1>
              <p className="text-slate-500 text-sm">
                Ringkasan statistik pengambilan makanan dan aktiviti terkini Dapur Siswa.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sistem Pengurusan Terkawal</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">JUMLAH PELAJAR</span>
                <span className="text-3xl font-black text-slate-900 mt-1 block">{stats?.totalStudents || 0}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">PENGAMBILAN HARI INI</span>
                <span className="text-3xl font-black text-emerald-600 mt-1 block">{stats?.pickupsToday || 0}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">PENGAMBILAN BULAN INI</span>
                <span className="text-3xl font-black text-teal-600 mt-1 block">{stats?.pickupsThisMonth || 0}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">JENIS MAKANAN AKTIF</span>
                <span className="text-3xl font-black text-amber-600 mt-1 block">{stats?.activeFoodCount || 0}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Aktiviti Pengambilan Terkini</h2>
                <p className="text-xs text-slate-500">15 rekod transaksi terkini yang direkodkan pelajar</p>
              </div>

              <Link
                href="/admin/pickups"
                className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 transition"
              >
                <span>LIHAT SEMUA REKOD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentPickups.length === 0 ? (
              <EmptyState title="Tiada Aktiviti Terkini" description="Belum ada sebarang transaksi pengambilan makanan hari ini." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4 rounded-l-xl">Masa</th>
                      <th className="py-3 px-4">Nama Pelajar</th>
                      <th className="py-3 px-4">No. Matrik</th>
                      <th className="py-3 px-4">Program</th>
                      <th className="py-3 px-4 rounded-r-xl">Makanan Diambil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {recentPickups.map((p) => {
                      const pDate = new Date(p.pickupDate);
                      const formattedDate = pDate.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                            <div className="text-slate-900 font-bold">{p.pickupTime}</div>
                            <div className="text-[11px] text-slate-400">{formattedDate}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{p.studentName}</td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">{p.studentId}</td>
                          <td className="py-3.5 px-4 text-slate-600">{p.program} (Sem {p.semester})</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 text-xs">
                              {p.foodsSummary}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
