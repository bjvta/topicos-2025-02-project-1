import { describe, test, expect } from '@jest/globals';
import { validateSeats } from '../../../src/validators/seatsValidator.js';

describe('validateSeats', () => {
  describe('Happy paths', () => {
    test('should return valid when seats are available', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 8,
        requestedCount: 2
      });

      expect(result.valid).toBe(true);
      expect(result.availableSeats).toBe(2);
      expect(result.remainingSeats).toBe(0);
    });

    test('should return valid when exactly enough seats', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 8,
        requestedCount: 2
      });

      expect(result.valid).toBe(true);
    });

    test('should return valid with default requestedCount of 1', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 8
      });

      expect(result.valid).toBe(true);
      expect(result.availableSeats).toBe(2);
      expect(result.remainingSeats).toBe(1);
    });

    test('should return valid when course is empty', () => {
      const result = validateSeats({
        capacity: 30,
        enrolledCount: 0,
        requestedCount: 1
      });

      expect(result.valid).toBe(true);
      expect(result.availableSeats).toBe(30);
      expect(result.remainingSeats).toBe(29);
    });
  });

  describe('Rejection cases', () => {
    test('should return false when seats are not available', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 8,
        requestedCount: 3
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('NO_CAPACITY');
      expect(result.message).toContain('Not enough seats available');
      expect(result.details).toEqual({
        capacity: 10,
        enrolledCount: 8,
        availableSeats: 2,
        requestedCount: 3
      });
    });

    test('should return false when course is already full', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 10,
        requestedCount: 1
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('NO_CAPACITY');
    });

    test('should return false when requesting more seats than capacity', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 0,
        requestedCount: 11
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('NO_CAPACITY');
    });
  });

  describe('Edge cases and validation', () => {
    test('should handle zero capacity', () => {
      const result = validateSeats({
        capacity: 0,
        enrolledCount: 0,
        requestedCount: 1
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('NO_CAPACITY');
    });

    test('should detect data inconsistency when enrolled exceeds capacity', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 15,
        requestedCount: 1
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('DATA_INCONSISTENCY');
      expect(result.message).toContain('Enrolled count exceeds capacity');
    });

    test('should reject invalid capacity (negative)', () => {
      const result = validateSeats({
        capacity: -5,
        enrolledCount: 0,
        requestedCount: 1
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_CAPACITY');
    });

    test('should reject invalid capacity (non-number)', () => {
      const result = validateSeats({
        capacity: 'invalid',
        enrolledCount: 0,
        requestedCount: 1
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_CAPACITY');
    });

    test('should reject invalid enrolledCount (negative)', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: -2,
        requestedCount: 1
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_ENROLLED_COUNT');
    });

    test('should reject invalid requestedCount (zero)', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 5,
        requestedCount: 0
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_REQUESTED_COUNT');
    });

    test('should reject invalid requestedCount (negative)', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 5,
        requestedCount: -1
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_REQUESTED_COUNT');
    });
  });

  describe('Boundary conditions', () => {
    test('should handle exactly one seat available', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 9,
        requestedCount: 1
      });

      expect(result.valid).toBe(true);
      expect(result.availableSeats).toBe(1);
      expect(result.remainingSeats).toBe(0);
    });

    test('should reject when requesting one more than available', () => {
      const result = validateSeats({
        capacity: 10,
        enrolledCount: 9,
        requestedCount: 2
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('NO_CAPACITY');
    });

    test('should handle large numbers', () => {
      const result = validateSeats({
        capacity: 1000,
        enrolledCount: 999,
        requestedCount: 1
      });

      expect(result.valid).toBe(true);
    });
  });
});
