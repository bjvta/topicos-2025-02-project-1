// calcularPrecioFinal.test.js
import { describe, test, expect } from 'vitest';
import { calcularPrecioFinal } from './calcularPrecioFinal.js';

describe('calcularPrecioFinal', () => {
  // Casos normales
  test('debe aplicar 10% de descuento a 100', () => {
    expect(calcularPrecioFinal(100, 10)).toBe(90);
  });

  test('debe aplicar 50% de descuento a 200', () => {
    expect(calcularPrecioFinal(200, 50)).toBe(100);
  });

  test('debe aplicar 25% de descuento a 80', () => {
    expect(calcularPrecioFinal(80, 25)).toBe(60);
  });

  // Edge cases - descuento en límites
  test('con descuento 0% debe retornar precio original', () => {
    expect(calcularPrecioFinal(100, 0)).toBe(100);
  });

  test('con descuento 100% debe retornar 0', () => {
    expect(calcularPrecioFinal(100, 100)).toBe(0);
  });

  // Casos inválidos - descuento fuera de rango
  test('con descuento negativo debe retornar precio original', () => {
    expect(calcularPrecioFinal(100, -10)).toBe(100);
  });

  test('con descuento mayor a 100 debe retornar precio original', () => {
    expect(calcularPrecioFinal(100, 150)).toBe(100);
  });

  // Casos inválidos - precio negativo
  test('con precio negativo debe retornar 0', () => {
    expect(calcularPrecioFinal(-50, 10)).toBe(0);
  });
});
