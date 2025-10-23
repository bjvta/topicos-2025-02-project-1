# Ejercicio 3: Práctica Independiente (25 min)

## 📝 Instrucciones para los estudiantes

**Función a implementar:** `calcularNotaFinal(parcial1, parcial2, final)`

### Descripción

Deben escribir tests Y la implementación para una función que calcula la nota final de un estudiante.

### Reglas de negocio

- La nota final se calcula: `(parcial1 * 0.3) + (parcial2 * 0.3) + (final * 0.4)`
- Todas las notas deben estar entre 0 y 100
- Si alguna nota es inválida (< 0 o > 100), retornar -1
- La nota final debe redondearse a 2 decimales

### Ejemplos de uso

```javascript
calcularNotaFinal(80, 90, 85)  // → 85.0
calcularNotaFinal(70, 80, 90)  // → 81.0
calcularNotaFinal(100, 100, 100) // → 100.0
calcularNotaFinal(0, 0, 0)     // → 0.0
calcularNotaFinal(-10, 80, 90) // → -1 (inválido)
calcularNotaFinal(80, 110, 90) // → -1 (inválido)
```

---

## 🎯 Pasos a seguir

### Paso 1 (5 min): Planificar
Piensen y escriban en papel qué casos deberían probar:
- ¿Cuáles son los casos normales?
- ¿Cuáles son los edge cases?
- ¿Qué validaciones necesitamos?

### Paso 2 (10 min): Escribir tests
Crear archivo `calcularNotaFinal.test.js` con todos los tests.

```javascript
import { describe, test, expect } from 'vitest';
import { calcularNotaFinal } from './calcularNotaFinal.js';

describe('calcularNotaFinal', () => {
  // Escribe tus tests aquí
});
```

### Paso 3 (5 min): Implementar
Crear archivo `calcularNotaFinal.js` con la función.

```javascript
export function calcularNotaFinal(parcial1, parcial2, final) {
  // Tu implementación aquí
}
```

### Paso 4 (5 min): Verificar
Ejecutar los tests y corregir si es necesario:

```bash
npm run test:ejercicio3
```

---

## ✅ Casos que deberían cubrir

- ✅ **Casos normales:** varias combinaciones de notas válidas
  - Ejemplo: (80, 90, 85), (70, 80, 90), (60, 70, 80)

- ✅ **Edge cases - límites:**
  - Todas las notas en 100
  - Todas las notas en 0
  - Nota mínima aprobatoria (51, 51, 51)

- ✅ **Validación - notas fuera de rango:**
  - parcial1 negativo
  - parcial2 mayor a 100
  - final negativo o mayor a 100

- ✅ **Redondeo:**
  - Verificar que redondea correctamente a 2 decimales

---

## 🎓 Preguntas del profesor

Mientras trabajan, el profesor puede preguntarles:

1. "¿Cuántos tests van a escribir? ¿Por qué ese número?"
2. "Muéstrame tu test para el caso normal. ¿Qué valores elegiste?"
3. "¿Qué pasa si todas las notas son 100? ¿Escribiste un test para eso?"
4. "¿Qué debería retornar si parcial1 es -10?"
5. "¿Cómo calculaste que 80, 90, 85 debe dar 85?"
6. "Si ejecutas tus tests ahora, ¿pasan todos? ¿Cuál falla?"
7. "¿Por qué es importante redondear a 2 decimales?"

---

## 💡 Solución de referencia (para el profesor)

<details>
<summary>Click para ver la solución (NO mostrar hasta que terminen)</summary>

**calcularNotaFinal.test.js:**
```javascript
import { describe, test, expect } from 'vitest';
import { calcularNotaFinal } from './calcularNotaFinal.js';

describe('calcularNotaFinal', () => {
  // Casos normales
  test('debe calcular correctamente con notas 80, 90, 85', () => {
    expect(calcularNotaFinal(80, 90, 85)).toBe(85);
  });

  test('debe calcular correctamente con notas 70, 80, 90', () => {
    expect(calcularNotaFinal(70, 80, 90)).toBe(81);
  });

  test('debe calcular correctamente con notas 60, 70, 80', () => {
    // (60*0.3) + (70*0.3) + (80*0.4) = 18 + 21 + 32 = 71
    expect(calcularNotaFinal(60, 70, 80)).toBe(71);
  });

  // Edge cases - límites
  test('debe manejar todas las notas en 100', () => {
    expect(calcularNotaFinal(100, 100, 100)).toBe(100);
  });

  test('debe manejar todas las notas en 0', () => {
    expect(calcularNotaFinal(0, 0, 0)).toBe(0);
  });

  test('debe manejar nota mínima aprobatoria (51, 51, 51)', () => {
    expect(calcularNotaFinal(51, 51, 51)).toBe(51);
  });

  // Casos inválidos - notas fuera de rango
  test('debe retornar -1 si parcial1 es negativo', () => {
    expect(calcularNotaFinal(-10, 80, 90)).toBe(-1);
  });

  test('debe retornar -1 si parcial2 es mayor a 100', () => {
    expect(calcularNotaFinal(80, 110, 90)).toBe(-1);
  });

  test('debe retornar -1 si final es negativo', () => {
    expect(calcularNotaFinal(80, 90, -5)).toBe(-1);
  });

  test('debe retornar -1 si final es mayor a 100', () => {
    expect(calcularNotaFinal(80, 90, 105)).toBe(-1);
  });

  // Test de redondeo
  test('debe redondear correctamente a 2 decimales', () => {
    // (85*0.3) + (90*0.3) + (88*0.4) = 25.5 + 27 + 35.2 = 87.7
    expect(calcularNotaFinal(85, 90, 88)).toBe(87.7);
  });
});
```

**calcularNotaFinal.js:**
```javascript
export function calcularNotaFinal(parcial1, parcial2, final) {
  // Validar que todas las notas estén en rango válido (0-100)
  if (
    parcial1 < 0 || parcial1 > 100 ||
    parcial2 < 0 || parcial2 > 100 ||
    final < 0 || final > 100
  ) {
    return -1;
  }

  // Calcular nota final con ponderaciones
  const notaFinal = (parcial1 * 0.3) + (parcial2 * 0.3) + (final * 0.4);

  // Redondear a 2 decimales
  return Math.round(notaFinal * 100) / 100;
}
```

</details>
