'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Berlaku Ralat Sistem</h2>
        <p className="text-slate-600 text-sm mb-6">
          Sistem mengalami ralat sementara. Sila cuba muat semula halaman.
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all"
        >
          Cuba Semula
        </button>
      </div>
    </div>
  );
}
