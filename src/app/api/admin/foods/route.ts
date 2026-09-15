import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const foods = await db.food.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ foods });
  } catch (error) {
    console.error('Error fetching admin foods:', error);
    return NextResponse.json({ error: 'Gagal membuka senarai stok makanan.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, category, imageUrl, status } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Sila masukkan Nama Stok dan Kategori.' }, { status: 400 });
    }

    const newFood = await db.food.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        imageUrl: imageUrl ? imageUrl.trim() : null,
        status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Stok makanan berjaya ditambah!',
      food: newFood,
    });
  } catch (error) {
    console.error('Error creating food:', error);
    return NextResponse.json({ error: 'Gagal menambah stok makanan baharu.' }, { status: 500 });
  }
}
