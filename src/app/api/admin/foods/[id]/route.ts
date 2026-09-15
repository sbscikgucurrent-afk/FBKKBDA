import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, category, imageUrl } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Nama stok dan kategori adalah wajib.' }, { status: 400 });
    }

    const updated = await db.food.update({
      where: { id },
      data: {
        name: name.trim(),
        category: category.trim(),
        imageUrl: imageUrl !== undefined ? (imageUrl ? imageUrl.trim() : null) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Maklumat stok makanan berjaya dikemas kini.',
      food: updated,
    });
  } catch (error) {
    console.error('Error updating food:', error);
    return NextResponse.json({ error: 'Gagal mengemas kini maklumat stok makanan.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses tidak dibenarkan.' }, { status: 403 });
    }

    const { id } = params;
    await db.food.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Stok makanan berjaya dipadamkan.',
    });
  } catch (error) {
    console.error('Error deleting food:', error);
    return NextResponse.json({ error: 'Gagal memadam stok makanan.' }, { status: 500 });
  }
}
