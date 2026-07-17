import { prisma } from "../config/prisma.js";

export class DashboardController {
  async getStats(req, res) {
    const totalClasses = await prisma.class.count();
    const totalWaitlist = await prisma.waitlist.count();
    const totalNotifications = await prisma.sMSNotification.count();

    const pending = await prisma.sMSNotification.count({
      where: {
        deliveryStatus: "pending",
      },
    });

    const delivered = await prisma.sMSNotification.count({
      where: {
        deliveryStatus: "delivered",
      },
    });

    const failed = await prisma.sMSNotification.count({
      where: {
        deliveryStatus: "failed",
      },
    });

    res.json({
      success: true,
      data: {
        totalClasses,
        totalWaitlist,
        totalNotifications,
        pending,
        delivered,
        failed,
      },
    });
  }
}