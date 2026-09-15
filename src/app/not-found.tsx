import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">404</h2>
        <p className="text-slate-600 text-sm mb-6">Halaman tidak dijumpai.</p>
        <Link
          href="/"
          className="inline-block w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all"
        >
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}
