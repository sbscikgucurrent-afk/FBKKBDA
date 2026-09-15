import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const foods = await db.food.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ foods });
  } catch (error) {
    console.error('Error fetching student foods:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan senarai makanan.' }, { status: 500 });
  }
}
