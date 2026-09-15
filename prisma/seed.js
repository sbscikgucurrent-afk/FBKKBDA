const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // Create initial Admin
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { icNumber: '880101018888' },
    update: {},
    create: {
      name: 'Pentadbir Dapur Siswa',
      icNumber: '880101018888',
      studentId: 'ADMIN001',
      program: 'Pentadbiran',
      semester: 0,
      phone: '0100000000',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('Admin user created:', admin.name);

  // Sample Students
  const studentPasswordHash = await bcrypt.hash('pelajar123', 10);

  const student1 = await prisma.user.upsert({
    where: { icNumber: '050101011234' },
    update: {},
    create: {
      name: 'Ahmad bin Zulkifli',
      icNumber: '050101011234',
      studentId: '24DKE1001',
      program: 'Sijil Teknologi Elektrik',
      semester: 3,
      phone: '0123456789',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { icNumber: '040202025678' },
    update: {},
    create: {
      name: 'Siti Nurhaliza binti Ramli',
      icNumber: '040202025678',
      studentId: '24DTM1002',
      program: 'Sijil Teknologi Maklumat',
      semester: 2,
      phone: '0198765432',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  });

  const student3 = await prisma.user.upsert({
    where: { icNumber: '050303039999' },
    update: {},
    create: {
      name: 'Ali Imran bin Hassan',
      icNumber: '050303039999',
      studentId: '25DTA1003',
      program: 'Diploma Teknologi Automotif',
      semester: 1,
      phone: '0171122334',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  });

  console.log('Sample students created.');

  // Sample Foods
  const foodsData = [
    { name: 'Biskut Cream Cracker', category: 'Biskut', status: 'ACTIVE' },
    { name: 'Roti Gardenia', category: 'Makanan', status: 'ACTIVE' },
    { name: 'Cereal Instant', category: 'Makanan', status: 'ACTIVE' },
    { name: 'Milo 3-in-1', category: 'Minuman', status: 'ACTIVE' },
    { name: 'Kopi 3-in-1', category: 'Minuman', status: 'ACTIVE' },
    { name: 'Susu Kotak 250ml', category: 'Minuman', status: 'ACTIVE' },
    { name: 'Air Mineral 500ml', category: 'Minuman', status: 'ACTIVE' },
    { name: 'Makanan Ringan', category: 'Makanan Ringan', status: 'ACTIVE' },
  ];

  const createdFoods = [];
  for (const food of foodsData) {
    const existing = await prisma.food.findFirst({ where: { name: food.name } });
    if (!existing) {
      const f = await prisma.food.create({ data: food });
      createdFoods.push(f);
    } else {
      createdFoods.push(existing);
    }
  }

  console.log('Foods created count:', createdFoods.length);

  // Sample Pickups for testing initial dashboard stats
  const existingPickups = await prisma.pickup.count();
  if (existingPickups === 0) {
    const now = new Date();
    const todayStr = now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Ahmad pickup today
    const p1 = await prisma.pickup.create({
      data: {
        userId: student1.id,
        pickupDate: now,
        pickupTime: todayStr,
        items: {
          create: [
            { foodId: createdFoods[0].id, foodName: createdFoods[0].name },
            { foodId: createdFoods[3].id, foodName: createdFoods[3].name },
            { foodId: createdFoods[6].id, foodName: createdFoods[6].name },
          ],
        },
      },
    });

    // Siti pickup today
    const p2 = await prisma.pickup.create({
      data: {
        userId: student2.id,
        pickupDate: now,
        pickupTime: todayStr,
        items: {
          create: [
            { foodId: createdFoods[1].id, foodName: createdFoods[1].name },
            { foodId: createdFoods[5].id, foodName: createdFoods[5].name },
          ],
        },
      },
    });

    // Ali pickup 3 days ago
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const p3 = await prisma.pickup.create({
      data: {
        userId: student3.id,
        pickupDate: threeDaysAgo,
        pickupTime: '09:15 AM',
        items: {
          create: [
            { foodId: createdFoods[2].id, foodName: createdFoods[2].name },
            { foodId: createdFoods[6].id, foodName: createdFoods[6].name },
          ],
        },
      },
    });

    console.log('Sample pickups created:', [p1.id, p2.id, p3.id]);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
