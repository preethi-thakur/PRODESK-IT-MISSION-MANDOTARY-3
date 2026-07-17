import { ClassService } from '../services/classService.js';
import { isValidUUID } from '../utils/validator.js';

export class ClassController {
  constructor() {
    this.classService = new ClassService();
  }

  async getAllClasses(req, res, next) {
    try {
      const classes = await this.classService.getAllClasses();
      const response = {
        success: true,
        message: 'Classes retrieved successfully',
        data: classes,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getClassById(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!isValidUUID(id)) {
        const response = {
          success: false,
          message: 'Invalid UUID format',
        };
        return res.status(400).json(response);
      }

      const classData = await this.classService.getClassById(id);
      
      if (!classData) {
        const response = {
          success: false,
          message: 'Class not found',
        };
        return res.status(404).json(response);
      }

      const response = {
        success: true,
        message: 'Class retrieved successfully',
        data: classData,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createClass(req, res, next) {
    try {
      const classData = await this.classService.createClass(req.body);
      const response = {
        success: true,
        message: 'Class created successfully',
        data: classData,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateClass(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!isValidUUID(id)) {
        const response = {
          success: false,
          message: 'Invalid UUID format',
        };
        return res.status(400).json(response);
      }

      const classData = await this.classService.updateClass(id, req.body);
      const response = {
        success: true,
        message: 'Class updated successfully',
        data: classData,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteClass(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!isValidUUID(id)) {
        const response = {
          success: false,
          message: 'Invalid UUID format',
        };
        return res.status(400).json(response);
      }

      await this.classService.deleteClass(id);
      const response = {
        success: true,
        message: 'Class deleted successfully',
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
