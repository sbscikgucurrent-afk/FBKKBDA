import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const whereClause: any = {
      userId: session.userId,
    };

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
      include: {
        items: true,
      },
      orderBy: {
        pickupDate: 'desc',
      },
    });

    const totalCount = await db.pickup.count({
      where: { userId: session.userId },
    });

    const lastPickup = await db.pickup.findFirst({
      where: { userId: session.userId },
      orderBy: { pickupDate: 'desc' },
      select: { pickupDate: true, pickupTime: true },
    });

    return NextResponse.json({
      pickups,
      totalCount,
      lastPickup,
    });
  } catch (error) {
    console.error('Error fetching student pickups:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan sejarah pengambilan.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const body = await request.json();
    const { foodIds } = body;

    if (!Array.isArray(foodIds) || foodIds.length === 0) {
      return NextResponse.json({ error: 'Sila pilih sekurang-kurangnya satu makanan.' }, { status: 400 });
    }

    const lastRecentPickup = await db.pickup.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    });

    if (lastRecentPickup) {
      const timeDiffSeconds = (Date.now() - new Date(lastRecentPickup.createdAt).getTime()) / 1000;
      if (timeDiffSeconds < 30) {
        return NextResponse.json(
          { error: 'Sila tunggu 30 saat sebelum membuat pendaftaran pengambilan seterusnya.' },
          { status: 429 }
        );
      }
    }

    const activeFoods = await db.food.findMany({
      where: {
        id: { in: foodIds },
        status: 'ACTIVE',
      },
    });

    if (activeFoods.length === 0) {
      return NextResponse.json({ error: 'Makanan yang dipilih tidak lagi aktif.' }, { status: 400 });
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('ms-MY', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newPickup = await db.pickup.create({
      data: {
        userId: session.userId,
        pickupDate: now,
        pickupTime: formattedTime,
        items: {
          create: activeFoods.map((food) => ({
            foodId: food.id,
            foodName: food.name,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengambilan makanan berjaya direkodkan!',
      pickup: newPickup,
    });
  } catch (error) {
    console.error('Error creating pickup:', error);
    return NextResponse.json({ error: 'Maaf, terdapat masalah semasa menyimpan rekod. Sila cuba lagi.' }, { status: 500 });
  }
}
