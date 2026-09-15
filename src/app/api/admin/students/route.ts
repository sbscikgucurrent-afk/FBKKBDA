import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, maskIC } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';
    const program = searchParams.get('program')?.trim() || '';
    const semester = searchParams.get('semester')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';

    const whereClause: any = {
      role: 'STUDENT',
    };

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { icNumber: { contains: query } },
        { studentId: { contains: query } },
      ];
    }

    if (program) {
      whereClause.program = program;
    }

    if (semester) {
      const semInt = parseInt(semester, 10);
      if (!isNaN(semInt)) whereClause.semester = semInt;
    }

    if (status) {
      whereClause.status = status;
    }

    const students = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        icNumber: true,
        studentId: true,
        program: true,
        semester: true,
        phone: true,
        status: true,
        createdAt: true,
        _count: {
          select: { pickups: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedStudents = students.map((s) => ({
      ...s,
      maskedIc: maskIC(s.icNumber),
      fullIc: s.icNumber,
      totalPickups: s._count.pickups,
    }));

    return NextResponse.json({ students: formattedStudents });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan senarai pelajar.' }, { status: 500 });
  }
}
