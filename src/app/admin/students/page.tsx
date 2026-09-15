'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../../../components/AdminSidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { Search, Users, Eye, EyeOff } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  maskedIc: string;
  fullIc: string;
  studentId: string;
  program: string;
  semester: number;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  totalPickups: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [programFilter, setProgramFilter] = useState<string>('');
  const [semesterFilter, setSemesterFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFullIcMap, setShowFullIcMap] = useState<Record<string, boolean>>({});

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      if (search) queryParams.set('q', search);
      if (programFilter) queryParams.set('program', programFilter);
      if (semesterFilter) queryParams.set('semester', semesterFilter);
      if (statusFilter) queryParams.set('status', statusFilter);

      const res = await fetch(`/api/admin/students?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, programFilter, semesterFilter, statusFilter]);

  const toggleShowIc = (id: string) => {
    setShowFullIcMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const programsList = Array.from(new Set(students.map((s) => s.program).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar userName="Pentadbir" role="ADMIN" />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Senarai Pelajar
              </h1>
              <p className="text-slate-500 text-sm">
                Senarai pelajar berdaftar di bawah sistem Foodbank Dapur Siswa MADANI.
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 self-start sm:self-auto">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Jumlah Pelajar: {students.length} orang</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari Nama / IC / Matrik..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Semua Program</option>
                {programsList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Semua Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Semua Status</option>
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Tidak Aktif</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Memuatkan senarai pelajar..." />
          ) : students.length === 0 ? (
            <EmptyState title="Tiada Pelajar Ditemui" description="Tiada rekod pelajar ditemui mengikut kriteria carian anda." />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                      <th className="py-4 px-6">Nama Pelajar</th>
                      <th className="py-4 px-6">No. IC</th>
                      <th className="py-4 px-6">No. Matrik</th>
                      <th className="py-4 px-6">Program / Semester</th>
                      <th className="py-4 px-6 text-center">Pengambilan</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          <div>{student.name}</div>
                          <div className="text-xs font-medium text-slate-400">Tel: {student.phone}</div>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-700">
                          <div className="flex items-center gap-2">
                            <span>{showFullIcMap[student.id] ? student.fullIc : student.maskedIc}</span>
                            <button
                              onClick={() => toggleShowIc(student.id)}
                              className="text-slate-400 hover:text-slate-600 transition"
                              title="Tunjuk / Sembunyi IC"
                            >
                              {showFullIcMap[student.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-slate-800 uppercase">{student.studentId}</td>
                        <td className="py-4 px-6 text-slate-700">
                          <div className="font-semibold">{student.program}</div>
                          <div className="text-xs text-slate-400">Semester {student.semester}</div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-block bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">
                            {student.totalPickups} kali
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              student.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {student.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
