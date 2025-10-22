import { v4 as uuidv4 } from 'uuid';
import { validateSeats } from '../validators/seatsValidator.js';
import { validateBulkEnrollment } from '../validators/scheduleValidator.js';

/**
 * In-memory database simulation
 * In a real application, this would be replaced with actual database calls
 */
class InMemoryDatabase {
  constructor() {
    this.enrollments = new Map();
    this.enrollmentsByRequestId = new Map(); // Index for fast requestId lookup
    this.courses = new Map();
    this.students = new Map();
    this.queue = [];
  }

  async createEnrollment(data) {
    const id = data.id || uuidv4();
    const enrollment = {
      id,
      ...data,
      createdAt: new Date()
    };
    this.enrollments.set(id, enrollment);

    // Index by requestId for fast idempotency checks
    if (data.requestId) {
      this.enrollmentsByRequestId.set(data.requestId, enrollment);
    }

    return enrollment;
  }

  async getEnrollment(id) {
    return this.enrollments.get(id);
  }

  async updateEnrollment(id, updates) {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) {
      throw new Error(`Enrollment ${id} not found`);
    }
    const updated = { ...enrollment, ...updates };
    this.enrollments.set(id, updated);
    return updated;
  }

  async getCourse(id) {
    return this.courses.get(id);
  }

  async createCourse(data) {
    const course = {
      ...data,
      enrolledCount: data.enrolledCount || 0
    };
    this.courses.set(data.id, course);
    return course;
  }

  async updateCourse(id, updates) {
    const course = this.courses.get(id);
    if (!course) {
      throw new Error(`Course ${id} not found`);
    }
    const updated = { ...course, ...updates };
    this.courses.set(id, updated);
    return updated;
  }

  async getEnrolledCourses(studentId) {
    const enrolledCourses = [];
    for (const enrollment of this.enrollments.values()) {
      if (enrollment.studentId === studentId && enrollment.status === 'CONFIRMED') {
        const course = this.courses.get(enrollment.courseId);
        if (course) {
          enrolledCourses.push(course);
        }
      }
    }
    return enrolledCourses;
  }

  async findEnrollmentByRequestId(requestId) {
    return this.enrollmentsByRequestId.get(requestId) || null;
  }

  /**
   * Atomically creates an enrollment only if requestId doesn't exist
   * Returns existing enrollment if requestId already exists (idempotency)
   * This prevents race conditions in concurrent requests
   */
  async createEnrollmentIfNotExists(data) {
    // Check if requestId already exists
    const existing = this.enrollmentsByRequestId.get(data.requestId);
    if (existing) {
      return { enrollment: existing, created: false };
    }

    // Create new enrollment
    const enrollment = await this.createEnrollment(data);
    return { enrollment, created: true };
  }

  async enqueueJob(job) {
    this.queue.push(job);
  }

  async getNextJob() {
    return this.queue.shift();
  }

  async clearAll() {
    this.enrollments.clear();
    this.enrollmentsByRequestId.clear();
    this.courses.clear();
    this.students.clear();
    this.queue = [];
  }
}

// Singleton instance
export const db = new InMemoryDatabase();

/**
 * Enrollment Service
 * Handles enrollment business logic
 */
export class EnrollmentService {
  /**
   * Create an enrollment request
   * @param {Object} params - Enrollment parameters
   * @param {string} params.studentId - Student ID
   * @param {string} params.courseId - Course ID
   * @param {string} params.requestId - Unique request ID for idempotency
   * @returns {Promise<Object>} Created enrollment
   */
  async createEnrollmentRequest({ studentId, courseId, requestId }) {
    // Get course information first
    const course = await db.getCourse(courseId);
    if (!course) {
      throw new Error('COURSE_NOT_FOUND');
    }

    // Validate seats availability (quick check)
    const validation = validateSeats({
      capacity: course.capacity,
      enrolledCount: course.enrolledCount,
      requestedCount: 1
    });

    if (!validation.valid) {
      // If obviously no capacity, check idempotency then reject
      const { enrollment, created } = await db.createEnrollmentIfNotExists({
        studentId,
        courseId,
        requestId,
        status: 'REJECTED',
        rejectionReason: validation.error,
        rejectionMessage: validation.message
      });

      if (!created) {
        console.log(`[${requestId}] Duplicate request detected, returning existing enrollment`);
      }

      return enrollment;
    }

    // Atomically create enrollment in PENDING status (handles idempotency)
    const { enrollment, created } = await db.createEnrollmentIfNotExists({
      studentId,
      courseId,
      requestId,
      status: 'PENDING'
    });

    if (!created) {
      // Request already exists (idempotency)
      console.log(`[${requestId}] Duplicate request detected, returning existing enrollment`);
      return enrollment;
    }

    console.log(`[${requestId}] Enrollment created with status PENDING`);

    // Enqueue for processing
    await db.enqueueJob({
      type: 'PROCESS_ENROLLMENT',
      enrollmentId: enrollment.id,
      requestId
    });

    return enrollment;
  }

  /**
   * Process an enrollment (worker logic)
   * @param {string} enrollmentId - Enrollment ID to process
   * @returns {Promise<Object>} Updated enrollment
   */
  async processEnrollment(enrollmentId) {
    const enrollment = await db.getEnrollment(enrollmentId);
    if (!enrollment) {
      throw new Error('ENROLLMENT_NOT_FOUND');
    }

    const course = await db.getCourse(enrollment.courseId);
    if (!course) {
      throw new Error('COURSE_NOT_FOUND');
    }

    // Re-validate seats (actual check at processing time)
    const validation = validateSeats({
      capacity: course.capacity,
      enrolledCount: course.enrolledCount,
      requestedCount: 1
    });

    if (!validation.valid) {
      // Reject enrollment
      const updated = await db.updateEnrollment(enrollmentId, {
        status: 'REJECTED',
        rejectionReason: validation.error,
        rejectionMessage: validation.message,
        processedAt: new Date()
      });
      console.log(`[${enrollment.requestId}] Enrollment rejected: ${validation.error}`);
      return updated;
    }

    // Confirm enrollment and increment counter
    await db.updateCourse(course.id, {
      enrolledCount: course.enrolledCount + 1
    });

    const updated = await db.updateEnrollment(enrollmentId, {
      status: 'CONFIRMED',
      processedAt: new Date()
    });

    console.log(`[${enrollment.requestId}] Enrollment confirmed`);
    return updated;
  }

  /**
   * Process next job in queue (simulates worker)
   * @returns {Promise<Object|null>} Processed enrollment or null if queue empty
   */
  async processNextJob() {
    const job = await db.getNextJob();
    if (!job) {
      return null;
    }

    if (job.type === 'PROCESS_ENROLLMENT') {
      return await this.processEnrollment(job.enrollmentId);
    }

    return null;
  }

  /**
   * Process all jobs in queue
   * @returns {Promise<Array>} Array of processed enrollments
   */
  async processAllJobs() {
    const results = [];
    let job;
    while ((job = await db.getNextJob())) {
      if (job.type === 'PROCESS_ENROLLMENT') {
        const result = await this.processEnrollment(job.enrollmentId);
        results.push(result);
      }
    }
    return results;
  }
}
