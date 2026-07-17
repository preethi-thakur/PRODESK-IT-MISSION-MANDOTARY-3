import { NotificationRepository } from '../repositories/notificationRepository.js';
import { WaitlistRepository } from '../repositories/waitlistRepository.js';
import { sanitizeObject } from '../utils/sanitizer.js';
import { logAnalytics } from '../utils/logger.js';

export class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.waitlistRepository = new WaitlistRepository();
  }

  async getAllNotifications() {
    return this.notificationRepository.findAll();
  }

  async sendNotification(data) {
    const sanitized = sanitizeObject(data);
    
    const waitlistEntry = await this.waitlistRepository.findById(sanitized.waitlistId);
    if (!waitlistEntry) {
      throw new Error('Waitlist entry not found');
    }

    const message = sanitized.message || `Your position in the waitlist is ${waitlistEntry.position}. We will notify you when a spot becomes available.`;
    
    const notification = await this.notificationRepository.create({
      waitlistId: sanitized.waitlistId,
      message,
      provider: 'Twilio-Mock',
      deliveryStatus: 'sent',
      sentAt: new Date(),
    });

    logAnalytics('Send SMS Notification');
    return notification;
  }

  async getNotificationCount() {
    return this.notificationRepository.count();
  }
}
