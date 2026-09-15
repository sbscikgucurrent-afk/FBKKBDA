'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../../../components/AdminSidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import Toast, { ToastMessage } from '../../../components/Toast';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff, FileSpreadsheet, Download } from 'lucide-react';

interface PickupRow {
  id: string;
  pickupDate: string;
  pickupTime: string;
  studentName: string;
  studentId: string;
  maskedIc: string;
  fullIc: string;
  program: string;
  semester: number;
  foods: string[];
  foodsSummary: string;
}

export default function AdminPickupsPage() {
  const [pickups, setPickups] = useState<PickupRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [programFilter, setProgramFilter] = useState<string>('');
  const [semesterFilter, setSemesterFilter] = useState<string>('');
  const [foodFilter, setFoodFilter] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [showFullIcMap, setShowFullIcMap] = useState<Record<string, boolean>>({});
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));

      if (search) params.set('search', search);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (programFilter) params.set('program', programFilter);
      if (semesterFilter) params.set('semester', semesterFilter);
      if (foodFilter) params.set('foodName', foodFilter);

      const res = await fetch(`/api/admin/pickups?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPickups(data.pickups || []);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalRecords(data.pagination.totalRecords || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, [page, limit, search, startDate, endDate, programFilter, semesterFilter, foodFilter]);

  const handleResetFilter = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setProgramFilter('');
    setSemesterFilter('');
    setFoodFilter('');
    setPage(1);
  };

  const toggleShowIc = (id: string) => {
    setShowFullIcMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    setToast(null);

    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const downloadUrl = `/api/admin/export?${params.toString()}`;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setToast({
        type: 'success',
        message: 'Data rekod pengambilan berjaya dieksport ke format Excel (CSV)!',
      });
    } catch (e) {
      setToast({ type: 'error', message: 'Gagal mengeksport data ke Excel.' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar userName="Pentadbir" role="ADMIN" />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Rekod Pengambilan
              </h1>
              <p className="text-slate-500 text-sm">
                Senarai penuh transaksi pengambilan makanan oleh pelajar.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-2xl text-sm font-bold">
                Jumpa: {totalRecords} Transaksi
              </div>

              <button
                type="button"
                onClick={handleExportExcel}
                disabled={isExporting}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl shadow-md shadow-emerald-200 text-sm transition disabled:opacity-50"
              >
                {isExporting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                <span>EKSPORT EXCEL</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Carian &amp; Penapis Data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Carian Teks</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Nama / No. IC / No. Matrik..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Mula</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Akhir</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Program</label>
                <input
                  type="text"
                  placeholder="Contoh: Sijil Teknologi..."
                  value={programFilter}
                  onChange={(e) => {
                    setProgramFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Semester</label>
                <select
                  value={semesterFilter}
                  onChange={(e) => {
                    setSemesterFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800"
                >
                  <option value="">Semua Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Jenis Makanan</label>
                <input
                  type="text"
                  placeholder="Contoh: Biskut, Milo..."
                  value={foodFilter}
                  onChange={(e) => {
                    setFoodFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleResetFilter}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET FILTER</span>
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Memuatkan rekod pengambilan..." />
          ) : pickups.length === 0 ? (
            <EmptyState title="Tiada Rekod Ditemui" description="Tiada transaksi pengambilan makanan ditemui bagi carian ini." />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                      <th className="py-4 px-4">Tarikh &amp; Masa</th>
                      <th className="py-4 px-4">Nama Pelajar</th>
                      <th className="py-4 px-4">No. IC</th>
                      <th className="py-4 px-4">No. Matrik</th>
                      <th className="py-4 px-4">Program &amp; Sem</th>
                      <th className="py-4 px-4">Makanan Diambil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pickups.map((p) => {
                      const pDate = new Date(p.pickupDate);
                      const formattedDate = pDate.toLocaleDateString('ms-MY', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      });
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{formattedDate}</div>
                            <div className="text-xs font-semibold text-emerald-700">{p.pickupTime}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{p.studentName}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{showFullIcMap[p.id] ? p.fullIc : p.maskedIc}</span>
                              <button
                                onClick={() => toggleShowIc(p.id)}
                                className="text-slate-400 hover:text-slate-600"
                                title="Tunjukkan IC Penuh"
                              >
                                {showFullIcMap[p.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800 uppercase whitespace-nowrap">{p.studentId}</td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <div className="font-semibold text-xs">{p.program}</div>
                            <div className="text-[11px] text-slate-400">Sem {p.semester}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {p.foods.map((food, idx) => (
                                <span
                                  key={idx}
                                  className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-lg border border-emerald-100 text-xs"
                                >
                                  {food}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <span>Paparkan</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 font-bold text-slate-800"
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>rekod per halaman</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-medium">
                    Halaman <strong className="text-slate-800">{page}</strong> daripada <strong className="text-slate-800">{totalPages}</strong>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
