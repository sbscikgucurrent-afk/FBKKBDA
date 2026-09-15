import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Log keluar berjaya.' });
  response.cookies.delete('jk_session');
  return response;
}
