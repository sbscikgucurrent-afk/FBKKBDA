'use client';

import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = 'Memuatkan...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      {text && <p className="text-sm font-semibold text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
}
