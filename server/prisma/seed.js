import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.sMSNotification.deleteMany();
  await prisma.waitlist.deleteMany();
  await prisma.class.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      fullName: 'Regular User',
      email: 'user@example.com',
      role: 'user',
    },
  });

  const class1 = await prisma.class.create({
    data: {
      className: 'Introduction to React',
      instructor: 'John Smith',
      capacity: 20,
      scheduledAt: new Date('2024-02-15T10:00:00Z'),
    },
  });

  const class2 = await prisma.class.create({
    data: {
      className: 'Advanced TypeScript',
      instructor: 'Jane Doe',
      capacity: 15,
      scheduledAt: new Date('2024-02-20T14:00:00Z'),
    },
  });

  const class3 = await prisma.class.create({
    data: {
      className: 'Node.js Fundamentals',
      instructor: 'Bob Johnson',
      capacity: 25,
      scheduledAt: new Date('2024-03-01T09:00:00Z'),
    },
  });

  const waitlist1 = await prisma.waitlist.create({
    data: {
      classId: class1.id,
      userName: 'Alice Williams',
      phoneNumber: '+1234567890',
      position: 1,
      status: 'pending',
    },
  });

  const waitlist2 = await prisma.waitlist.create({
    data: {
      classId: class1.id,
      userName: 'Charlie Brown',
      phoneNumber: '+1987654321',
      position: 2,
      status: 'pending',
    },
  });

  const waitlist3 = await prisma.waitlist.create({
    data: {
      classId: class2.id,
      userName: 'Diana Prince',
      phoneNumber: '+1555555555',
      position: 1,
      status: 'confirmed',
    },
  });

  await prisma.sMSNotification.create({
    data: {
      waitlistId: waitlist1.id,
      message: 'Your position in the waitlist is 1. We will notify you when a spot becomes available.',
      provider: 'Twilio-Mock',
      deliveryStatus: 'sent',
      sentAt: new Date(),
    },
  });

  await prisma.sMSNotification.create({
    data: {
      waitlistId: waitlist2.id,
      message: 'Your position in the waitlist is 2. We will notify you when a spot becomes available.',
      provider: 'Twilio-Mock',
      deliveryStatus: 'sent',
      sentAt: new Date(),
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
