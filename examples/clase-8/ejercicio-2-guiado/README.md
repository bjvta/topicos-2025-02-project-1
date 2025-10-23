# Ejercicio 2: Práctica Guiada (20 min)

### Función a implementar

`validarCuposDisponibles(capacidad, inscritos, solicitados)`

**Descripción:**
- Verifica si hay suficientes cupos disponibles en una materia
- Retorna: `{ disponible: boolean, mensaje: string }`

**Reglas de negocio:**
- Si `inscritos + solicitados <= capacidad`: hay cupos disponibles
- Si `inscritos + solicitados > capacidad`: NO hay cupos
- Si cualquier número es negativo: error de validación
- Si `capacidad` es 0: no hay cupos disponibles

---

## 🎯 Flujo sugerido para la clase

### 1. Identificar casos (5 min)
Pregunta a la clase:
- "¿Cuál sería el caso más común de uso de esta función?"
- "¿Qué casos 'raros' o en los límites deberíamos considerar?"
- "¿Qué pasa si alguien manda un número negativo?"

Escribir en la pizarra los casos identificados.

### 2. Escribir tests juntos (10 min)

Crear archivo `validarCuposDisponibles.test.js` y escribir tests paso a paso:

```javascript
import { describe, test, expect } from 'vitest';
import { validarCuposDisponibles } from './validarCuposDisponibles.js';

describe('validarCuposDisponibles', () => {
  // Ir agregando tests uno por uno con la clase
});
```

**Casos a cubrir:**
- ✅ Hay cupos suficientes (30, 20, 5)
- ✅ Exactamente el último cupo (30, 25, 5)
- ✅ No hay cupos (30, 28, 5)
- ✅ Materia llena (30, 30, 1)
- ✅ Sin inscritos (30, 0, 10)
- ✅ Nadie solicita (30, 20, 0)
- ✅ Capacidad 0 (0, 0, 5)
- ✅ Números negativos (-10, 5, 2), (30, -5, 2), (30, 20, -3)

### 3. Implementar la función juntos (5 min)

Crear archivo `validarCuposDisponibles.js`:

```javascript
export function validarCuposDisponibles(capacidad, inscritos, solicitados) {
  // Implementar juntos con la clase
}
```

**Preguntas durante implementación:**
- "¿Qué validamos primero: los cupos o los datos inválidos?"
- "¿Cómo calculamos los cupos disponibles?"
- "¿Esta implementación maneja bien todos nuestros tests?"

### 4. Ejecutar y verificar (5 min)

```bash
npm run test:ejercicio2
```

**Preguntas finales:**
- "Si ejecutamos `npm test` ahora, ¿qué esperamos ver?"
- "¿Podemos mejorar esta función sin romper los tests?"

---

## 💡 Solución de referencia

<details>
<summary>Click para ver la solución (NO mostrar hasta el final)</summary>

**validarCuposDisponibles.test.js:**
```javascript
import { describe, test, expect } from 'vitest';
import { validarCuposDisponibles } from './validarCuposDisponibles.js';

describe('validarCuposDisponibles', () => {
  test('debe retornar disponible:true cuando hay cupos suficientes', () => {
    const resultado = validarCuposDisponibles(30, 20, 5);
    expect(resultado.disponible).toBe(true);
    expect(resultado.mensaje).toBe('Hay cupos disponibles');
  });

  test('debe retornar disponible:true cuando se usa exactamente el último cupo', () => {
    const resultado = validarCuposDisponibles(30, 25, 5);
    expect(resultado.disponible).toBe(true);
  });

  test('debe retornar disponible:false cuando no hay cupos suficientes', () => {
    const resultado = validarCuposDisponibles(30, 28, 5);
    expect(resultado.disponible).toBe(false);
    expect(resultado.mensaje).toBe('No hay cupos disponibles');
  });

  test('debe retornar disponible:false cuando la materia ya está llena', () => {
    const resultado = validarCuposDisponibles(30, 30, 1);
    expect(resultado.disponible).toBe(false);
  });

  test('debe retornar disponible:true cuando no hay inscritos aún', () => {
    const resultado = validarCuposDisponibles(30, 0, 10);
    expect(resultado.disponible).toBe(true);
  });

  test('debe retornar disponible:true cuando nadie solicita inscribirse', () => {
    const resultado = validarCuposDisponibles(30, 20, 0);
    expect(resultado.disponible).toBe(true);
  });

  test('debe retornar disponible:false cuando capacidad es 0', () => {
    const resultado = validarCuposDisponibles(0, 0, 5);
    expect(resultado.disponible).toBe(false);
  });

  test('debe manejar capacidad negativa', () => {
    const resultado = validarCuposDisponibles(-10, 5, 2);
    expect(resultado.disponible).toBe(false);
    expect(resultado.mensaje).toContain('inválido');
  });

  test('debe manejar inscritos negativos', () => {
    const resultado = validarCuposDisponibles(30, -5, 2);
    expect(resultado.disponible).toBe(false);
    expect(resultado.mensaje).toContain('inválido');
  });

  test('debe manejar solicitados negativos', () => {
    const resultado = validarCuposDisponibles(30, 20, -3);
    expect(resultado.disponible).toBe(false);
    expect(resultado.mensaje).toContain('inválido');
  });
});
```

**validarCuposDisponibles.js:**
```javascript
export function validarCuposDisponibles(capacidad, inscritos, solicitados) {
  // Validar que todos los números sean válidos (>= 0)
  if (capacidad < 0 || inscritos < 0 || solicitados < 0) {
    return {
      disponible: false,
      mensaje: 'Parámetro inválido: los valores no pueden ser negativos'
    };
  }

  // Caso especial: capacidad es 0
  if (capacidad === 0) {
    return {
      disponible: false,
      mensaje: 'No hay cupos disponibles'
    };
  }

  // Calcular cupos disponibles
  const cuposDisponibles = capacidad - inscritos;
  const hayCupos = solicitados <= cuposDisponibles;

  return {
    disponible: hayCupos,
    mensaje: hayCupos ? 'Hay cupos disponibles' : 'No hay cupos disponibles'
  };
}
```

</details>
