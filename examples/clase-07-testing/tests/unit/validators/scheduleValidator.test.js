import { describe, test, expect } from '@jest/globals';
import { hasScheduleOverlap, validateBulkEnrollment } from '../../../src/validators/scheduleValidator.js';

describe('hasScheduleOverlap', () => {
  test('should detect overlap when courses have same time slot', () => {
    const schedule1 = [
      { day: 'monday', startTime: '08:00', endTime: '10:00' }
    ];
    const schedule2 = [
      { day: 'monday', startTime: '08:00', endTime: '10:00' }
    ];

    expect(hasScheduleOverlap(schedule1, schedule2)).toBe(true);
  });

  test('should detect overlap when courses partially overlap', () => {
    const schedule1 = [
      { day: 'monday', startTime: '08:00', endTime: '10:00' }
    ];
    const schedule2 = [
      { day: 'monday', startTime: '09:00', endTime: '11:00' }
    ];

    expect(hasScheduleOverlap(schedule1, schedule2)).toBe(true);
  });

  test('should return false when courses are on different days', () => {
    const schedule1 = [
      { day: 'monday', startTime: '08:00', endTime: '10:00' }
    ];
    const schedule2 = [
      { day: 'tuesday', startTime: '08:00', endTime: '10:00' }
    ];

    expect(hasScheduleOverlap(schedule1, schedule2)).toBe(false);
  });

  test('should return false when courses are consecutive (no overlap)', () => {
    const schedule1 = [
      { day: 'monday', startTime: '08:00', endTime: '10:00' }
    ];
    const schedule2 = [
      { day: 'monday', startTime: '10:00', endTime: '12:00' }
    ];

    expect(hasScheduleOverlap(schedule1, schedule2)).toBe(false);
  });

  test('should handle courses with multiple time slots', () => {
    const schedule1 = [
      { day: 'monday', startTime: '08:00', endTime: '10:00' },
      { day: 'wednesday', startTime: '08:00', endTime: '10:00' }
    ];
    const schedule2 = [
      { day: 'tuesday', startTime: '08:00', endTime: '10:00' },
      { day: 'wednesday', startTime: '09:00', endTime: '11:00' }
    ];

    expect(hasScheduleOverlap(schedule1, schedule2)).toBe(true);
  });

  test('should return false when no overlap in multiple slots', () => {
    const schedule1 = [
      { day: 'monday', startTime: '08:00', endTime: '10:00' },
      { day: 'wednesday', startTime: '08:00', endTime: '10:00' }
    ];
    const schedule2 = [
      { day: 'tuesday', startTime: '08:00', endTime: '10:00' },
      { day: 'thursday', startTime: '08:00', endTime: '10:00' }
    ];

    expect(hasScheduleOverlap(schedule1, schedule2)).toBe(false);
  });
});

describe('validateBulkEnrollment', () => {
  describe('Conflict between requested courses', () => {
    test('should detect conflict between two requested courses', () => {
      const enrolledCourses = [];
      const requestedCourses = [
        {
          id: 'cs-101',
          name: 'Programming I',
          capacity: 30,
          enrolledCount: 10,
          schedule: [
            { day: 'monday', startTime: '08:00', endTime: '10:00' }
          ]
        },
        {
          id: 'math-101',
          name: 'Calculus I',
          capacity: 25,
          enrolledCount: 5,
          schedule: [
            { day: 'monday', startTime: '09:00', endTime: '11:00' }
          ]
        }
      ];

      const result = validateBulkEnrollment(enrolledCourses, requestedCourses);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('CONFLICT_BETWEEN_REQUESTED');
      expect(result.conflictingCourses).toHaveLength(2);
      expect(result.message).toContain('Programming I');
      expect(result.message).toContain('Calculus I');
    });

    test('should pass when requested courses do not conflict', () => {
      const enrolledCourses = [];
      const requestedCourses = [
        {
          id: 'cs-101',
          name: 'Programming I',
          capacity: 30,
          enrolledCount: 10,
          schedule: [
            { day: 'monday', startTime: '08:00', endTime: '10:00' }
          ]
        },
        {
          id: 'math-101',
          name: 'Calculus I',
          capacity: 25,
          enrolledCount: 5,
          schedule: [
            { day: 'tuesday', startTime: '10:00', endTime: '12:00' }
          ]
        }
      ];

      const result = validateBulkEnrollment(enrolledCourses, requestedCourses);

      expect(result.valid).toBe(true);
    });
  });

  describe('Conflict with enrolled courses', () => {
    test('should detect conflict with already enrolled course', () => {
      const enrolledCourses = [
        {
          id: 'physics-101',
          name: 'Physics I',
          schedule: [
            { day: 'wednesday', startTime: '14:00', endTime: '16:00' }
          ]
        }
      ];
      const requestedCourses = [
        {
          id: 'cs-201',
          name: 'Programming II',
          capacity: 25,
          enrolledCount: 10,
          schedule: [
            { day: 'wednesday', startTime: '15:00', endTime: '17:00' }
          ]
        }
      ];

      const result = validateBulkEnrollment(enrolledCourses, requestedCourses);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('CONFLICT_WITH_ENROLLED');
      expect(result.conflictingCourses).toHaveLength(2);
      expect(result.message).toContain('Programming II');
      expect(result.message).toContain('Physics I');
    });

    test('should pass when no conflict with enrolled courses', () => {
      const enrolledCourses = [
        {
          id: 'physics-101',
          name: 'Physics I',
          schedule: [
            { day: 'monday', startTime: '14:00', endTime: '16:00' }
          ]
        }
      ];
      const requestedCourses = [
        {
          id: 'cs-201',
          name: 'Programming II',
          capacity: 25,
          enrolledCount: 10,
          schedule: [
            { day: 'tuesday', startTime: '10:00', endTime: '12:00' }
          ]
        }
      ];

      const result = validateBulkEnrollment(enrolledCourses, requestedCourses);

      expect(result.valid).toBe(true);
    });
  });

  describe('Capacity validation', () => {
    test('should reject when one course has no capacity', () => {
      const enrolledCourses = [];
      const requestedCourses = [
        {
          id: 'cs-101',
          name: 'Programming I',
          capacity: 10,
          enrolledCount: 10, // Full
          schedule: [
            { day: 'monday', startTime: '08:00', endTime: '10:00' }
          ]
        }
      ];

      const result = validateBulkEnrollment(enrolledCourses, requestedCourses);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('NO_CAPACITY');
      expect(result.coursesWithoutCapacity).toHaveLength(1);
      expect(result.coursesWithoutCapacity[0].id).toBe('cs-101');
    });

    test('should reject when multiple courses have no capacity', () => {
      const enrolledCourses = [];
      const requestedCourses = [
        {
          id: 'cs-101',
          name: 'Programming I',
          capacity: 10,
          enrolledCount: 10, // Full
          schedule: [
            { day: 'monday', startTime: '08:00', endTime: '10:00' }
          ]
        },
        {
          id: 'math-101',
          name: 'Calculus I',
          capacity: 20,
          enrolledCount: 20, // Full
          schedule: [
            { day: 'tuesday', startTime: '10:00', endTime: '12:00' }
          ]
        }
      ];

      const result = validateBulkEnrollment(enrolledCourses, requestedCourses);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('NO_CAPACITY');
      expect(result.coursesWithoutCapacity).toHaveLength(2);
    });

    test('should pass when all courses have capacity', () => {
      const enrolledCourses = [];
      const requestedCourses = [
        {
          id: 'cs-101',
          name: 'Programming I',
          capacity: 30,
          enrolledCount: 10, // Has capacity
          schedule: [
            { day: 'monday', startTime: '08:00', endTime: '10:00' }
          ]
        },
        {
          id: 'math-101',
          name: 'Calculus I',
          capacity: 25,
          enrolledCount: 5, // Has capacity
          schedule: [
            { day: 'tuesday', startTime: '10:00', endTime: '12:00' }
          ]
        }
      ];

      const result = validateBulkEnrollment(enrolledCourses, requestedCourses);

      expect(result.valid).toBe(true);
    });
  });

  describe('Complex scenarios', () => {
    test('should validate complex scenario with multiple checks', () => {
      const enrolledCourses = [
        {
          id: 'english-101',
          name: 'English I',
          schedule: [
            { day: 'friday', startTime: '08:00', endTime: '10:00' }
          ]
        }
      ];
      const requestedCourses = [
        {
          id: 'cs-101',
          name: 'Programming I',
          capacity: 30,
          enrolledCount: 25,
          schedule: [
            { day: 'monday', startTime: '08:00', endTime: '10:00' },
            { day: 'wednesday', startTime: '08:00', endTime: '10:00' }
          ]
        },
        {
          id: 'math-101',
          name: 'Calculus I',
          capacity: 25,
          enrolledCount: 5,
          schedule: [
            { day: 'tuesday', startTime: '10:00', endTime: '12:00' },
            { day: 'thursday', startTime: '10:00', endTime: '12:00' }
          ]
        }
      ];

      const result = validateBulkEnrollment(enrolledCourses, requestedCourses);

      expect(result.valid).toBe(true);
    });
  });
});
