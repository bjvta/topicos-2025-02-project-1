/**
 * Validates schedule conflicts between courses
 */

/**
 * Converts time string (HH:MM) to minutes since midnight
 * @param {string} timeString - Time in format "HH:MM"
 * @returns {number} Minutes since midnight
 */
function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks if two time ranges overlap
 * @param {string} start1 - Start time of first range (HH:MM)
 * @param {string} end1 - End time of first range (HH:MM)
 * @param {string} start2 - Start time of second range (HH:MM)
 * @param {string} end2 - End time of second range (HH:MM)
 * @returns {boolean} True if ranges overlap
 */
function timeRangesOverlap(start1, end1, start2, end2) {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  // Two ranges overlap if one starts before the other ends
  return s1 < e2 && s2 < e1;
}

/**
 * Checks if two course schedules overlap
 * @param {Array} schedule1 - First course schedule
 * @param {Array} schedule2 - Second course schedule
 * @returns {boolean} True if schedules overlap
 */
export function hasScheduleOverlap(schedule1, schedule2) {
  for (const slot1 of schedule1) {
    for (const slot2 of schedule2) {
      // Check if same day
      if (slot1.day === slot2.day) {
        // Check if time ranges overlap
        if (timeRangesOverlap(slot1.startTime, slot1.endTime, slot2.startTime, slot2.endTime)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Validates bulk enrollment for schedule conflicts
 * @param {Array} enrolledCourses - Courses already enrolled
 * @param {Array} requestedCourses - Courses being requested
 * @returns {Object} Validation result
 */
export function validateBulkEnrollment(enrolledCourses, requestedCourses) {
  // 1. Check conflicts BETWEEN requested courses
  for (let i = 0; i < requestedCourses.length; i++) {
    for (let j = i + 1; j < requestedCourses.length; j++) {
      const course1 = requestedCourses[i];
      const course2 = requestedCourses[j];

      if (hasScheduleOverlap(course1.schedule, course2.schedule)) {
        return {
          valid: false,
          error: 'CONFLICT_BETWEEN_REQUESTED',
          message: `Schedule conflict between ${course1.name} and ${course2.name}`,
          conflictingCourses: [course1, course2]
        };
      }
    }
  }

  // 2. Check conflicts with already enrolled courses
  for (const requested of requestedCourses) {
    for (const enrolled of enrolledCourses) {
      if (hasScheduleOverlap(requested.schedule, enrolled.schedule)) {
        return {
          valid: false,
          error: 'CONFLICT_WITH_ENROLLED',
          message: `Schedule conflict between ${requested.name} (new) and ${enrolled.name} (already enrolled)`,
          conflictingCourses: [requested, enrolled]
        };
      }
    }
  }

  // 3. Check capacity for all requested courses
  const coursesWithoutCapacity = requestedCourses.filter(
    course => course.enrolledCount >= course.capacity
  );

  if (coursesWithoutCapacity.length > 0) {
    return {
      valid: false,
      error: 'NO_CAPACITY',
      message: 'One or more courses do not have available seats',
      coursesWithoutCapacity
    };
  }

  return { valid: true };
}
