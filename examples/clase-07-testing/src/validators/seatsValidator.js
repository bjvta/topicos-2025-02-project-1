/**
 * Validates if there are enough seats available for enrollment
 *
 * @param {Object} params - Validation parameters
 * @param {number} params.capacity - Total capacity of the course
 * @param {number} params.enrolledCount - Current number of enrolled students
 * @param {number} params.requestedCount - Number of seats being requested (default: 1)
 * @returns {Object} Validation result with 'valid' boolean and optional 'error' message
 */
export function validateSeats({ capacity, enrolledCount, requestedCount = 1 }) {
  // Validate input parameters
  if (typeof capacity !== 'number' || capacity < 0) {
    return {
      valid: false,
      error: 'INVALID_CAPACITY',
      message: 'Capacity must be a non-negative number'
    };
  }

  if (typeof enrolledCount !== 'number' || enrolledCount < 0) {
    return {
      valid: false,
      error: 'INVALID_ENROLLED_COUNT',
      message: 'Enrolled count must be a non-negative number'
    };
  }

  if (typeof requestedCount !== 'number' || requestedCount < 1) {
    return {
      valid: false,
      error: 'INVALID_REQUESTED_COUNT',
      message: 'Requested count must be a positive number'
    };
  }

  // Check if enrolled count already exceeds capacity (data inconsistency)
  if (enrolledCount > capacity) {
    return {
      valid: false,
      error: 'DATA_INCONSISTENCY',
      message: 'Enrolled count exceeds capacity'
    };
  }

  // Calculate available seats
  const availableSeats = capacity - enrolledCount;

  // Check if there are enough seats
  if (availableSeats < requestedCount) {
    return {
      valid: false,
      error: 'NO_CAPACITY',
      message: `Not enough seats available. Available: ${availableSeats}, Requested: ${requestedCount}`,
      details: {
        capacity,
        enrolledCount,
        availableSeats,
        requestedCount
      }
    };
  }

  // Validation passed
  return {
    valid: true,
    availableSeats,
    remainingSeats: availableSeats - requestedCount
  };
}
