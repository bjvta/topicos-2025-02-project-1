import { describe, test, expect, beforeEach } from '@jest/globals';
import { EnrollmentService, db } from '../../src/services/enrollmentService.js';

describe('Enrollment Flow Integration Tests', () => {
  let enrollmentService;

  beforeEach(async () => {
    // Clear database before each test
    await db.clearAll();
    enrollmentService = new EnrollmentService();
  });

  describe('Complete enrollment flow: PENDING → CONFIRMED', () => {
    test('should complete full enrollment flow when seats are available', async () => {
      // 1. Setup: Create a course with available seats
      const course = await db.createCourse({
        id: 'test-course-1',
        name: 'Programming I',
        capacity: 10,
        enrolledCount: 0
      });

      // 2. Create enrollment request
      const enrollment = await enrollmentService.createEnrollmentRequest({
        studentId: 'student-1',
        courseId: course.id,
        requestId: 'req-001'
      });

      // 3. Verify enrollment created in PENDING status
      expect(enrollment.status).toBe('PENDING');
      expect(enrollment.studentId).toBe('student-1');
      expect(enrollment.courseId).toBe(course.id);
      expect(enrollment.requestId).toBe('req-001');

      // 4. Process the queue (simulate worker)
      const processed = await enrollmentService.processNextJob();

      // 5. Verify enrollment was confirmed
      expect(processed.id).toBe(enrollment.id);
      expect(processed.status).toBe('CONFIRMED');
      expect(processed.processedAt).toBeDefined();

      // 6. Verify course enrolled count was incremented
      const updatedCourse = await db.getCourse(course.id);
      expect(updatedCourse.enrolledCount).toBe(1);
    });

    test('should confirm multiple enrollments sequentially', async () => {
      // Setup course
      const course = await db.createCourse({
        id: 'test-course-2',
        name: 'Calculus I',
        capacity: 5,
        enrolledCount: 0
      });

      // Create 3 enrollment requests
      const enrollment1 = await enrollmentService.createEnrollmentRequest({
        studentId: 'student-1',
        courseId: course.id,
        requestId: 'req-001'
      });

      const enrollment2 = await enrollmentService.createEnrollmentRequest({
        studentId: 'student-2',
        courseId: course.id,
        requestId: 'req-002'
      });

      const enrollment3 = await enrollmentService.createEnrollmentRequest({
        studentId: 'student-3',
        courseId: course.id,
        requestId: 'req-003'
      });

      // All should be PENDING
      expect(enrollment1.status).toBe('PENDING');
      expect(enrollment2.status).toBe('PENDING');
      expect(enrollment3.status).toBe('PENDING');

      // Process all jobs
      const results = await enrollmentService.processAllJobs();

      // All should be confirmed
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.status).toBe('CONFIRMED');
      });

      // Verify course count
      const updatedCourse = await db.getCourse(course.id);
      expect(updatedCourse.enrolledCount).toBe(3);
    });
  });

  describe('Complete enrollment flow: PENDING → REJECTED', () => {
    test('should reject enrollment when course is full', async () => {
      // Setup: Course already at capacity
      const course = await db.createCourse({
        id: 'test-course-3',
        name: 'Database Systems',
        capacity: 10,
        enrolledCount: 10 // Already full
      });

      // Create enrollment request
      const enrollment = await enrollmentService.createEnrollmentRequest({
        studentId: 'student-1',
        courseId: course.id,
        requestId: 'req-004'
      });

      // Should be immediately rejected (quick validation)
      expect(enrollment.status).toBe('REJECTED');
      expect(enrollment.rejectionReason).toBe('NO_CAPACITY');
      expect(enrollment.rejectionMessage).toContain('Not enough seats available');

      // Verify course count didn't change
      const updatedCourse = await db.getCourse(course.id);
      expect(updatedCourse.enrolledCount).toBe(10);
    });

    test('should reject when course fills up during processing', async () => {
      // Setup: Course with only 2 seats left
      const course = await db.createCourse({
        id: 'test-course-4',
        name: 'Operating Systems',
        capacity: 10,
        enrolledCount: 8
      });

      // Create 3 enrollment requests
      await enrollmentService.createEnrollmentRequest({
        studentId: 'student-1',
        courseId: course.id,
        requestId: 'req-005'
      });

      await enrollmentService.createEnrollmentRequest({
        studentId: 'student-2',
        courseId: course.id,
        requestId: 'req-006'
      });

      await enrollmentService.createEnrollmentRequest({
        studentId: 'student-3',
        courseId: course.id,
        requestId: 'req-007'
      });

      // Process all jobs
      const results = await enrollmentService.processAllJobs();

      // Count confirmed and rejected
      const confirmed = results.filter(r => r.status === 'CONFIRMED');
      const rejected = results.filter(r => r.status === 'REJECTED');

      expect(confirmed).toHaveLength(2); // Only 2 seats available
      expect(rejected).toHaveLength(1);  // Third one rejected

      // Verify course didn't exceed capacity
      const updatedCourse = await db.getCourse(course.id);
      expect(updatedCourse.enrolledCount).toBe(10); // 8 + 2 = 10 (max capacity)
    });
  });

  describe('Concurrency handling', () => {
    test('should handle concurrent enrollment requests correctly', async () => {
      // Setup: Course with limited seats
      const course = await db.createCourse({
        id: 'test-course-5',
        name: 'Software Engineering',
        capacity: 5,
        enrolledCount: 0
      });

      // Create 10 concurrent enrollment requests
      const promises = [];
      for (let i = 1; i <= 10; i++) {
        promises.push(
          enrollmentService.createEnrollmentRequest({
            studentId: `student-${i}`,
            courseId: course.id,
            requestId: `req-${i}`
          })
        );
      }

      // All requests should be created successfully
      const enrollments = await Promise.all(promises);
      expect(enrollments).toHaveLength(10);

      // All should initially be PENDING or REJECTED (if immediate validation)
      enrollments.forEach(enrollment => {
        expect(['PENDING', 'REJECTED']).toContain(enrollment.status);
      });

      // Process all jobs
      const results = await enrollmentService.processAllJobs();

      // Combine immediate rejections with processed results
      const allResults = enrollments.filter(e => e.status === 'REJECTED').concat(results);

      // Count final states
      const confirmed = allResults.filter(r => r.status === 'CONFIRMED');
      const rejected = allResults.filter(r => r.status === 'REJECTED');

      // Only 5 should be confirmed (capacity limit)
      expect(confirmed.length).toBe(5);
      expect(rejected.length).toBe(5);

      // Verify course capacity wasn't exceeded
      const updatedCourse = await db.getCourse(course.id);
      expect(updatedCourse.enrolledCount).toBe(5);
      expect(updatedCourse.enrolledCount).toBeLessThanOrEqual(course.capacity);
    });

    test('should maintain data consistency under high concurrency', async () => {
      // Setup: Multiple courses
      await db.createCourse({
        id: 'course-1',
        name: 'Course 1',
        capacity: 3,
        enrolledCount: 0
      });

      await db.createCourse({
        id: 'course-2',
        name: 'Course 2',
        capacity: 5,
        enrolledCount: 0
      });

      // Create many concurrent requests for both courses
      const promises = [];

      // 10 students trying to enroll in course-1 (capacity 3)
      for (let i = 1; i <= 10; i++) {
        promises.push(
          enrollmentService.createEnrollmentRequest({
            studentId: `student-${i}`,
            courseId: 'course-1',
            requestId: `req-course1-${i}`
          })
        );
      }

      // 15 students trying to enroll in course-2 (capacity 5)
      for (let i = 1; i <= 15; i++) {
        promises.push(
          enrollmentService.createEnrollmentRequest({
            studentId: `student-${i}`,
            courseId: 'course-2',
            requestId: `req-course2-${i}`
          })
        );
      }

      await Promise.all(promises);

      // Process all jobs
      await enrollmentService.processAllJobs();

      // Verify final state
      const course1 = await db.getCourse('course-1');
      const course2 = await db.getCourse('course-2');

      expect(course1.enrolledCount).toBeLessThanOrEqual(3);
      expect(course2.enrolledCount).toBeLessThanOrEqual(5);
    });
  });

  describe('Idempotency', () => {
    test('should handle duplicate request IDs (idempotency)', async () => {
      const course = await db.createCourse({
        id: 'test-course-6',
        name: 'Web Development',
        capacity: 10,
        enrolledCount: 0
      });

      // First request
      const enrollment1 = await enrollmentService.createEnrollmentRequest({
        studentId: 'student-1',
        courseId: course.id,
        requestId: 'duplicate-req-001'
      });

      // Duplicate request with same requestId
      const enrollment2 = await enrollmentService.createEnrollmentRequest({
        studentId: 'student-1',
        courseId: course.id,
        requestId: 'duplicate-req-001'
      });

      // Should return the same enrollment
      expect(enrollment1.id).toBe(enrollment2.id);
      expect(enrollment1.requestId).toBe(enrollment2.requestId);

      // Process queue
      await enrollmentService.processAllJobs();

      // Verify only one seat was taken
      const updatedCourse = await db.getCourse(course.id);
      expect(updatedCourse.enrolledCount).toBe(1); // Not 2
    });

    test('should handle multiple duplicate requests', async () => {
      const course = await db.createCourse({
        id: 'test-course-7',
        name: 'Mobile Development',
        capacity: 10,
        enrolledCount: 0
      });

      const requestId = 'multi-duplicate-req-001';

      // Send same request 5 times
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          enrollmentService.createEnrollmentRequest({
            studentId: 'student-1',
            courseId: course.id,
            requestId
          })
        );
      }

      const enrollments = await Promise.all(promises);

      // All should return the same enrollment ID
      const uniqueIds = new Set(enrollments.map(e => e.id));
      expect(uniqueIds.size).toBe(1);

      // Process queue
      await enrollmentService.processAllJobs();

      // Verify only one seat was taken
      const updatedCourse = await db.getCourse(course.id);
      expect(updatedCourse.enrolledCount).toBe(1);
    });
  });

  describe('Error handling', () => {
    test('should handle invalid course ID', async () => {
      await expect(
        enrollmentService.createEnrollmentRequest({
          studentId: 'student-1',
          courseId: 'non-existent-course',
          requestId: 'req-error-001'
        })
      ).rejects.toThrow('COURSE_NOT_FOUND');
    });

    test('should handle processing non-existent enrollment', async () => {
      await expect(
        enrollmentService.processEnrollment('non-existent-id')
      ).rejects.toThrow('ENROLLMENT_NOT_FOUND');
    });
  });

  describe('Edge cases', () => {
    test('should handle course with zero capacity', async () => {
      const course = await db.createCourse({
        id: 'test-course-8',
        name: 'Zero Capacity Course',
        capacity: 0,
        enrolledCount: 0
      });

      const enrollment = await enrollmentService.createEnrollmentRequest({
        studentId: 'student-1',
        courseId: course.id,
        requestId: 'req-zero-capacity'
      });

      expect(enrollment.status).toBe('REJECTED');
      expect(enrollment.rejectionReason).toBe('NO_CAPACITY');
    });

    test('should process empty queue gracefully', async () => {
      const result = await enrollmentService.processNextJob();
      expect(result).toBeNull();
    });

    test('should handle processAllJobs on empty queue', async () => {
      const results = await enrollmentService.processAllJobs();
      expect(results).toEqual([]);
    });
  });
});
