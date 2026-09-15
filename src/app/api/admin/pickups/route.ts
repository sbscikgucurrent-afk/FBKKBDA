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
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search')?.trim() || '';
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const program = searchParams.get('program')?.trim() || '';
    const semester = searchParams.get('semester')?.trim() || '';
    const foodName = searchParams.get('foodName')?.trim() || '';

    const whereClause: any = {};

    if (search) {
      whereClause.user = {
        OR: [
          { name: { contains: search } },
          { icNumber: { contains: search } },
          { studentId: { contains: search } },
        ],
      };
    }

    if (program || semester) {
      if (!whereClause.user) whereClause.user = {};
      if (program) whereClause.user.program = program;
      if (semester) {
        const semInt = parseInt(semester, 10);
        if (!isNaN(semInt)) whereClause.user.semester = semInt;
      }
    }

    if (startDateStr || endDateStr) {
      whereClause.pickupDate = {};
      if (startDateStr) {
        whereClause.pickupDate.gte = new Date(startDateStr);
      }
      if (endDateStr) {
        const eDate = new Date(endDateStr);
        eDate.setHours(23, 59, 59, 999);
        whereClause.pickupDate.lte = eDate;
      }
    }

    if (foodName) {
      whereClause.items = {
        some: {
          foodName: { contains: foodName },
        },
      };
    }

    const totalRecords = await db.pickup.count({ where: whereClause });
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    const pickups = await db.pickup.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { pickupDate: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            icNumber: true,
            studentId: true,
            program: true,
            semester: true,
          },
        },
        items: true,
      },
    });

    const formatted = pickups.map((p) => ({
      id: p.id,
      pickupDate: p.pickupDate,
      pickupTime: p.pickupTime,
      studentName: p.user.name,
      studentId: p.user.studentId,
      maskedIc: maskIC(p.user.icNumber),
      fullIc: p.user.icNumber,
      program: p.user.program,
      semester: p.user.semester,
      foods: p.items.map((i) => i.foodName),
      foodsSummary: p.items.map((i) => i.foodName).join(', '),
    }));

    return NextResponse.json({
      pickups: formatted,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching admin pickups:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan rekod pengambilan.' }, { status: 500 });
  }
}
