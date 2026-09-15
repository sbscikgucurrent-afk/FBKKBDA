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
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    const pickupWhere: any = {};

    if (startDateStr || endDateStr) {
      pickupWhere.pickupDate = {};
      if (startDateStr) pickupWhere.pickupDate.gte = new Date(startDateStr);
      if (endDateStr) {
        const eDate = new Date(endDateStr);
        eDate.setHours(23, 59, 59, 999);
        pickupWhere.pickupDate.lte = eDate;
      }
    }

    const items = await db.pickupItem.findMany({
      where: {
        pickup: pickupWhere,
      },
      select: {
        foodName: true,
      },
    });

    const foodCounts: Record<string, number> = {};
    items.forEach((item) => {
      foodCounts[item.foodName] = (foodCounts[item.foodName] || 0) + 1;
    });

    const foodStatsData = Object.keys(foodCounts)
      .map((foodName) => ({
        foodName,
        count: foodCounts[foodName],
      }))
      .sort((a, b) => b.count - a.count);

    const pickups = await db.pickup.findMany({
      where: pickupWhere,
      select: {
        pickupDate: true,
      },
      orderBy: { pickupDate: 'asc' },
    });

    const dailyCounts: Record<string, number> = {};
    pickups.forEach((p) => {
      const dateStr = p.pickupDate.toISOString().split('T')[0];
      dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
    });

    const dailyTrendData = Object.keys(dailyCounts).map((dateStr) => {
      const d = new Date(dateStr);
      const label = d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
      return {
        date: dateStr,
        label,
        count: dailyCounts[dateStr],
      };
    });

    return NextResponse.json({
      foodStats: foodStatsData,
      dailyTrend: dailyTrendData,
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan statistik.' }, { status: 500 });
  }
}
