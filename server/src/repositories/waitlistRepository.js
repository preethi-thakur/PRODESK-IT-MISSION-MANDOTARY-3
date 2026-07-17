import prisma from '../prisma/client.js';

export class WaitlistRepository {
  async findAll() {
    return prisma.waitlist.findMany({
      include: {
        class: {
          select: {
            id: true,
            className: true,
            instructor: true,
          },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  async findById(id) {
    return prisma.waitlist.findUnique({
      where: { id },
      include: {
        class: true,
        notifications: true,
      },
    });
  }

  async findByClassId(classId) {
    return prisma.waitlist.findMany({
      where: { classId },
      orderBy: { position: 'asc' },
    });
  }

  async create(data) {
    return prisma.waitlist.create({
      data,
      include: {
        class: {
          select: {
            id: true,
            className: true,
            instructor: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return prisma.waitlist.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.waitlist.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.waitlist.count();
  }

  async countByClassId(classId) {
    return prisma.waitlist.count({
      where: { classId },
    });
  }

  async findDuplicate(classId, phoneNumber) {
    return prisma.waitlist.findFirst({
      where: {
        classId,
        phoneNumber,
        status: { not: 'cancelled' },
      },
    });
  }

  async getNextPosition(classId) {
    const count = await this.countByClassId(classId);
    return count + 1;
  }
}
