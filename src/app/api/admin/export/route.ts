import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const search = searchParams.get('search')?.trim() || '';

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

    if (month && year) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      if (!isNaN(m) && !isNaN(y)) {
        const startDate = new Date(y, m - 1, 1);
        const endDate = new Date(y, m, 0, 23, 59, 59, 999);
        whereClause.pickupDate = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    const pickups = await db.pickup.findMany({
      where: whereClause,
      orderBy: { pickupDate: 'desc' },
      include: {
        user: true,
        items: true,
      },
    });

    const csvRows: string[] = [];
    csvRows.push(['"Tarikh"', '"Masa"', '"Nama Pelajar"', '"No. Kad Pengenalan"', '"No. Matrik"', '"Program"', '"Semester"', '"Makanan Diambil"'].join(','));

    pickups.forEach((p) => {
      const dateFormatted = p.pickupDate.toISOString().split('T')[0];
      const timeFormatted = p.pickupTime;
      const nameEscaped = `"${p.user.name.replace(/"/g, '""')}"`;
      const icEscaped = `"${p.user.icNumber}"`;
      const matricEscaped = `"${p.user.studentId}"`;
      const programEscaped = `"${p.user.program.replace(/"/g, '""')}"`;
      const semester = p.user.semester;
      const foodsEscaped = `"${p.items.map((i) => i.foodName).join('; ').replace(/"/g, '""')}"`;

      csvRows.push([dateFormatted, `"${timeFormatted}"`, nameEscaped, icEscaped, matricEscaped, programEscaped, semester, foodsEscaped].join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\r\n');

    const monthNames = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
    let filenameMonthYear = 'Keseluruhan';
    if (month && year) {
      const mIdx = parseInt(month, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        filenameMonthYear = `${monthNames[mIdx]}${year}`;
      }
    }

    const filename = `JomKenyang_Pengambilan_${filenameMonthYear}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating CSV export:', error);
    return NextResponse.json({ error: 'Gagal mengeksport data.' }, { status: 500 });
  }
}
