import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JOM KENYANG - Foodbank Dapur Siswa MADANI',
  description: 'Sistem Rekod Pengambilan Makanan Pelajar Foodbank Dapur Siswa MADANI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms">
      <body className="bg-slate-50 text-slate-800 antialiased selection:bg-emerald-200">
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
