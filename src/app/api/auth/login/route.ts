import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { icNumber, password } = body;

    if (!icNumber) {
      return NextResponse.json({ error: 'Sila masukkan No. Kad Pengenalan.' }, { status: 400 });
    }

    const cleanIC = icNumber.trim();

    const user = await db.user.findUnique({
      where: { icNumber: cleanIC },
    });

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'No. Kad Pengenalan belum didaftarkan atau tidak wujud.' }, { status: 401 });
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Akaun anda telah dinyahaktifkan. Sila hubungi pentadbir.' }, { status: 403 });
    }

    // Check if password matches (either passed password, IC number, or seed password)
    let isValidPassword = false;
    if (password) {
      isValidPassword = await verifyPassword(password, user.passwordHash);
    }
    if (!isValidPassword) {
      isValidPassword = await verifyPassword(cleanIC, user.passwordHash);
    }
    if (!isValidPassword) {
      isValidPassword = await verifyPassword('pelajar123', user.passwordHash);
    }

    if (!isValidPassword) {
      return NextResponse.json({ error: 'No. Kad Pengenalan tidak tepat.' }, { status: 401 });
    }

    const token = await signToken({
      userId: user.id,
      name: user.name,
      icNumber: user.icNumber,
      studentId: user.studentId,
      role: 'STUDENT',
      program: user.program,
      semester: user.semester,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Log masuk berjaya!',
      user: {
        id: user.id,
        name: user.name,
        icNumber: user.icNumber,
        studentId: user.studentId,
        program: user.program,
        semester: user.semester,
        role: user.role,
      },
    });

    response.cookies.set('jk_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error('Student Login Error:', error);
    return NextResponse.json({ error: 'Maaf, terdapat masalah semasa log masuk. Sila cuba lagi.' }, { status: 500 });
  }
}
