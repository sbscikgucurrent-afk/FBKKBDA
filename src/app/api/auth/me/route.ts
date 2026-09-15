import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        icNumber: true,
        studentId: true,
        program: true,
        semester: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json({ authenticated: false, error: 'User inactive' }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
