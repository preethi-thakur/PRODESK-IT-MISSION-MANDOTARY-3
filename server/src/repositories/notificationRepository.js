import prisma from '../prisma/client.js';

export class NotificationRepository {
  async findAll() {
    return prisma.sMSNotification.findMany({
      include: {
        waitlist: {
          select: {
            id: true,
            userName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return prisma.sMSNotification.findUnique({
      where: { id },
      include: {
        waitlist: true,
      },
    });
  }

  async findByWaitlistId(waitlistId) {
    return prisma.sMSNotification.findMany({
      where: { waitlistId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data) {
    return prisma.sMSNotification.create({
      data,
      include: {
        waitlist: {
          select: {
            id: true,
            userName: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async count() {
    return prisma.sMSNotification.count();
  }
}
