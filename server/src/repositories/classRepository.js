import prisma from '../prisma/client.js';

export class ClassRepository {
  async findAll() {
    return prisma.class.findMany({
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findById(id) {
    return prisma.class.findUnique({
      where: { id },
      include: {
        waitlist: {
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async create(data) {
    return prisma.class.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.class.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.class.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.class.count();
  }

  async findByClassName(className) {
    return prisma.class.findFirst({
      where: { className },
    });
  }
}
