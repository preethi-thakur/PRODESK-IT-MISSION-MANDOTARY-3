import { WaitlistRepository } from '../repositories/waitlistRepository.js';
import { ClassRepository } from '../repositories/classRepository.js';
import { sanitizeObject } from '../utils/sanitizer.js';
import { logAnalytics } from '../utils/logger.js';

export class WaitlistService {
  constructor() {
    this.waitlistRepository = new WaitlistRepository();
    this.classRepository = new ClassRepository();
  }

  async getAllWaitlistEntries() {
    return this.waitlistRepository.findAll();
  }

  async getWaitlistById(id) {
    return this.waitlistRepository.findById(id);
  }

  async addToWaitlist(data) {
    const sanitized = sanitizeObject(data);
    
    const classExists = await this.classRepository.findById(sanitized.classId);
    if (!classExists) {
      throw new Error('Class not found');
    }

    const duplicate = await this.waitlistRepository.findDuplicate(sanitized.classId, sanitized.phoneNumber);
    if (duplicate) {
      throw new Error('User already exists in waitlist for this class');
    }

    const position = await this.waitlistRepository.getNextPosition(sanitized.classId);
    const waitlistEntry = await this.waitlistRepository.create({
      ...sanitized,
      position,
      status: 'pending',
    });

    logAnalytics('Create Waitlist Entry');
    return waitlistEntry;
  }

  async updateWaitlistEntry(id, data) {
    const sanitized = sanitizeObject(data);
    
    if (sanitized.phoneNumber) {
      const existing = await this.waitlistRepository.findById(id);
      if (!existing) {
        throw new Error('Waitlist entry not found');
      }
      const duplicate = await this.waitlistRepository.findDuplicate(existing.classId, sanitized.phoneNumber);
      if (duplicate && duplicate.id !== id) {
        throw new Error('Phone number already exists in waitlist for this class');
      }
    }

    const updatedEntry = await this.waitlistRepository.update(id, sanitized);
    logAnalytics('Update Waitlist Entry');
    return updatedEntry;
  }

  async removeFromWaitlist(id) {
    await this.waitlistRepository.delete(id);
    logAnalytics('Delete Waitlist Entry');
  }

  async getWaitlistCount() {
    return this.waitlistRepository.count();
  }
}
