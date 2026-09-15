'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../../../components/AdminSidebar';
import Toast, { ToastMessage } from '../../../components/Toast';
import { Download, FileSpreadsheet, Calendar, Search } from 'lucide-react';

export default function AdminExportPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentDate.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState<string>(String(currentDate.getFullYear()));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

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

  const handleDownload = async () => {
    setIsDownloading(true);
    setToast(null);

    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.set('month', selectedMonth);
      if (selectedYear) params.set('year', selectedYear);
      if (searchQuery) params.set('search', searchQuery);

      const downloadUrl = `/api/admin/export?${params.toString()}`;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setToast({
        type: 'success',
        message: 'Laporan CSV berjaya dijana dan dimuat turun!',
      });
    } catch (e) {
      setToast({ type: 'error', message: 'Gagal memuat turun data laporan.' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar userName="Pentadbir" role="ADMIN" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Export Data Laporan
            </h1>
            <p className="text-slate-500 text-sm">
              Eksport rekod pengambilan makanan pelajar ke format CSV (serasi Microsoft Excel).
            </p>
          </div>

          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Format Fail CSV</h3>
                <p className="text-xs text-slate-600">
                  Mengandungi medan: Tarikh, Masa, Nama Pelajar, No. IC, No. Matrik, Program, Semester &amp; Makanan.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Pilih Tempoh Laporan:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Bulan</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Semua Bulan (Keseluruhan)</option>
                    {monthsList.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tahun</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Semua Tahun</option>
                    {yearsList.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Carian Tapis (Pilihan)</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tapis mengikut nama atau No. Matrik..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDownloading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Download className="w-5 h-5" />
                )}
                <span>MUAT TURUN LAPORAN CSV</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
