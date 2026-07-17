import { WaitlistService } from '../services/waitlistService.js';
import { isValidUUID } from '../utils/validator.js';

export class WaitlistController {
  constructor() {
    this.waitlistService = new WaitlistService();
  }

  async getAllWaitlistEntries(req, res, next) {
    try {
      const waitlist = await this.waitlistService.getAllWaitlistEntries();
      const response = {
        success: true,
        message: 'Waitlist entries retrieved successfully',
        data: waitlist,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getWaitlistById(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!isValidUUID(id)) {
        const response = {
          success: false,
          message: 'Invalid UUID format',
        };
        return res.status(400).json(response);
      }

      const waitlistEntry = await this.waitlistService.getWaitlistById(id);
      
      if (!waitlistEntry) {
        const response = {
          success: false,
          message: 'Waitlist entry not found',
        };
        return res.status(404).json(response);
      }

      const response = {
        success: true,
        message: 'Waitlist entry retrieved successfully',
        data: waitlistEntry,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async addToWaitlist(req, res, next) {
    try {
      const waitlistEntry = await this.waitlistService.addToWaitlist(req.body);
      const response = {
        success: true,
        message: 'Added to waitlist successfully',
        data: waitlistEntry,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateWaitlistEntry(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!isValidUUID(id)) {
        const response = {
          success: false,
          message: 'Invalid UUID format',
        };
        return res.status(400).json(response);
      }

      const waitlistEntry = await this.waitlistService.updateWaitlistEntry(id, req.body);
      const response = {
        success: true,
        message: 'Waitlist entry updated successfully',
        data: waitlistEntry,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeFromWaitlist(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!isValidUUID(id)) {
        const response = {
          success: false,
          message: 'Invalid UUID format',
        };
        return res.status(400).json(response);
      }

      await this.waitlistService.removeFromWaitlist(id);
      const response = {
        success: true,
        message: 'Removed from waitlist successfully',
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
