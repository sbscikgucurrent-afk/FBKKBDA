import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icNumber, studentId, program, semester, phone } = body;

    if (!name || !icNumber || !studentId || !program || !semester || !phone) {
      return NextResponse.json({ error: 'Sila isi semua maklumat yang diwajibkan.' }, { status: 400 });
    }

    if (!/^\d+$/.test(icNumber)) {
      return NextResponse.json({ error: 'No. Kad Pengenalan hanya boleh mengandungi nombor sahaja.' }, { status: 400 });
    }

    const cleanIC = icNumber.trim();

    const existingIC = await db.user.findUnique({
      where: { icNumber: cleanIC },
    });
    if (existingIC) {
      return NextResponse.json({ error: 'No. Kad Pengenalan telah pun didaftarkan.' }, { status: 400 });
    }

    const existingMatric = await db.user.findUnique({
      where: { studentId: studentId.trim().toUpperCase() },
    });
    if (existingMatric) {
      return NextResponse.json({ error: 'No. Matrik telah pun didaftarkan.' }, { status: 400 });
    }

    // Default password hash set to student's IC number
    const passwordHash = await hashPassword(cleanIC);
    const semInt = parseInt(semester, 10);

    const newUser = await db.user.create({
      data: {
        name: name.trim().toUpperCase(),
        icNumber: cleanIC,
        studentId: studentId.trim().toUpperCase(),
        program: program.trim(),
        semester: isNaN(semInt) ? 1 : semInt,
        phone: phone.trim(),
        passwordHash,
        role: 'STUDENT',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran akaun berjaya! Sila log masuk.',
      user: {
        id: newUser.id,
        name: newUser.name,
        icNumber: newUser.icNumber,
        studentId: newUser.studentId,
      },
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Maaf, terdapat masalah semasa pendaftaran. Sila cuba lagi.' }, { status: 500 });
  }
}
