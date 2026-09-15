'use client';

import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = 'Tiada Rekod Ditemui',
  description = 'Tiada maklumat yang tersedia untuk dipaparkan buat masa ini.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center my-6 space-y-3">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
