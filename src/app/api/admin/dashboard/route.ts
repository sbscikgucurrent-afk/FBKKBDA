import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, maskIC } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const totalStudents = await db.user.count({
      where: { role: 'STUDENT' },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const pickupsToday = await db.pickup.count({
      where: {
        pickupDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const pickupsThisMonth = await db.pickup.count({
      where: {
        pickupDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const activeFoodCount = await db.food.count({
      where: { status: 'ACTIVE' },
    });

    const recentPickups = await db.pickup.findMany({
      take: 15,
      orderBy: { pickupDate: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            studentId: true,
            icNumber: true,
            program: true,
            semester: true,
          },
        },
        items: true,
      },
    });

    const formattedRecent = recentPickups.map((p) => ({
      id: p.id,
      pickupDate: p.pickupDate,
      pickupTime: p.pickupTime,
      studentName: p.user.name,
      studentId: p.user.studentId,
      maskedIc: maskIC(p.user.icNumber),
      program: p.user.program,
      semester: p.user.semester,
      foodsSummary: p.items.map((i) => i.foodName).join(', '),
    }));

    return NextResponse.json({
      stats: {
        totalStudents,
        pickupsToday,
        pickupsThisMonth,
        activeFoodCount,
      },
      recentPickups: formattedRecent,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan data dashboard pentadbir.' }, { status: 500 });
  }
}
