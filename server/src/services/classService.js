import { ClassRepository } from '../repositories/classRepository.js';
import { sanitizeObject } from '../utils/sanitizer.js';
import { logAnalytics } from '../utils/logger.js';

export class ClassService {
  constructor() {
    this.classRepository = new ClassRepository();
  }

  async getAllClasses() {
    return this.classRepository.findAll();
  }

  async getClassById(id) {
    return this.classRepository.findById(id);
  }

  async createClass(data) {
    const sanitized = sanitizeObject(data);
    const existingClass = await this.classRepository.findByClassName(sanitized.className);
    
    if (existingClass) {
      throw new Error('Class with this name already exists');
    }

    const newClass = await this.classRepository.create(sanitized);
    logAnalytics('Create Class');
    return newClass;
  }

  async updateClass(id, data) {
    const sanitized = sanitizeObject(data);
    
    if (sanitized.className) {
      const existingClass = await this.classRepository.findByClassName(sanitized.className);
      if (existingClass && existingClass.id !== id) {
        throw new Error('Class with this name already exists');
      }
    }

    const updatedClass = await this.classRepository.update(id, sanitized);
    logAnalytics('Update Class');
    return updatedClass;
  }

  async deleteClass(id) {
    await this.classRepository.delete(id);
    logAnalytics('Delete Class');
  }

  async getClassCount() {
    return this.classRepository.count();
  }
}
