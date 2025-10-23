# 📆 (Clase 8) Jueves 23 de Octubre – Testing Práctico

---

# Revisión del día

- Qué son los tests y por qué son importantes
- Cómo escribir tests básicos con Jest/Vitest
- Práctica con 3 ejercicios de complejidad progresiva
- Identificar casos de prueba (normales y edge cases)

---

## 📚 Conceptos clave

### 1. ¿Qué es un test?

Un **test** (o prueba) es código que verifica automáticamente si tu código funciona correctamente.

**Analogía:** Es como cuando pruebas tu función manualmente en la consola:

```javascript
// Sin test (manual):
function suma(a, b) {
  return a + b;
}

console.log(suma(2, 3)); // Miras si imprime 5
console.log(suma(10, 5)); // Miras si imprime 15
```

**Con test (automatizado):**

```javascript
// Con test (automatizado):
test('suma debe sumar dos números', () => {
  expect(suma(2, 3)).toBe(5);
  expect(suma(10, 5)).toBe(15);
});
```

**Ventajas de los tests automatizados:**
- ✅ No tienes que probar manualmente cada vez que cambias algo
- ✅ Detectas bugs inmediatamente
- ✅ Te da confianza para refactorizar código
- ✅ Documenta cómo usar tu código

---

### 2. Anatomía de un test

Un test típico tiene 3 partes:

```javascript
test('descripción de qué estamos probando', () => {
  // 1. ARRANGE (preparar): configurar datos de prueba
  const numero = 10;
  const descuento = 20;

  // 2. ACT (actuar): ejecutar la función que queremos probar
  const resultado = calcularDescuento(numero, descuento);

  // 3. ASSERT (afirmar): verificar que el resultado es correcto
  expect(resultado).toBe(8);
});
```

**Estructura común con `describe` (agrupar tests relacionados):**

```javascript
describe('calcularDescuento', () => {
  test('debe aplicar 20% de descuento a 10', () => {
    const resultado = calcularDescuento(10, 20);
    expect(resultado).toBe(8);
  });

  test('debe aplicar 50% de descuento a 100', () => {
    const resultado = calcularDescuento(100, 50);
    expect(resultado).toBe(50);
  });

  test('debe retornar 0 cuando descuento es 100%', () => {
    const resultado = calcularDescuento(100, 100);
    expect(resultado).toBe(0);
  });
});
```

---

### 3. Tipos de casos de prueba

Cuando escribes tests, debes pensar en diferentes **tipos de casos**:

#### A. Casos normales (happy path)
Los casos típicos donde todo funciona bien:

```javascript
test('debe calcular el promedio de [10, 20, 30]', () => {
  expect(promedio([10, 20, 30])).toBe(20);
});
```

#### B. Edge cases (casos límite)
Los casos "raros" o en los límites:

```javascript
test('debe manejar array vacío', () => {
  expect(promedio([])).toBe(0);
});

test('debe manejar un solo elemento', () => {
  expect(promedio([5])).toBe(5);
});

test('debe manejar números negativos', () => {
  expect(promedio([-10, -20])).toBe(-15);
});
```

#### C. Casos inválidos
Cuando se pasan datos incorrectos:

```javascript
test('debe manejar null', () => {
  expect(promedio(null)).toBe(0);
});

test('debe manejar undefined', () => {
  expect(promedio(undefined)).toBe(0);
});
```

---

### 4. Matchers comunes (expect)

Los **matchers** son las funciones que usamos para verificar resultados:

```javascript
// Igualdad exacta
expect(2 + 2).toBe(4);

// Igualdad de objetos/arrays (contenido)
expect({ name: 'Juan' }).toEqual({ name: 'Juan' });

// Verificar verdadero/falso
expect(esValido).toBe(true);
expect(esInvalido).toBe(false);

// Verificar que algo existe
expect(usuario).toBeDefined();
expect(usuarioInexistente).toBeUndefined();

// Verificar null
expect(valor).toBeNull();
expect(valor).not.toBeNull();

// Verificar que contiene algo
expect([1, 2, 3]).toContain(2);
expect('Hola mundo').toContain('mundo');

// Números
expect(10).toBeGreaterThan(5);
expect(5).toBeLessThan(10);
expect(10.5).toBeCloseTo(10.5, 2); // para flotantes
```

---

## 🎯 ¿Cómo pensar en qué casos probar?

Cuando tienes una función, pregúntate:

1. **¿Cuál es el caso más común?** → Ese es tu primer test
2. **¿Qué pasa en los límites?** → Tests de edge cases
3. **¿Qué pasa si alguien manda datos raros?** → Tests de validación
4. **¿Qué NO debería hacer mi función?** → Tests negativos

**Ejemplo:** Para una función `esMayorDeEdad(edad)`:

```javascript
// Caso común
test('18 años es mayor de edad', () => {
  expect(esMayorDeEdad(18)).toBe(true);
});

// Límites
test('17 años NO es mayor de edad', () => {
  expect(esMayorDeEdad(17)).toBe(false);
});

// Datos raros
test('edad negativa retorna false', () => {
  expect(esMayorDeEdad(-5)).toBe(false);
});

test('edad 0 retorna false', () => {
  expect(esMayorDeEdad(0)).toBe(false);
});
```

---

## 💻 Ejercicios prácticos

> 💡 **Nota:** Los ejemplos completos de código están en la carpeta `examples/clase-8/`

### ⭐ Ejercicio 1: Demo del profesor (15 min)

**Función a probar:** `calcularPrecioFinal(precio, descuento)`

**Descripción:**
- Recibe un precio y un porcentaje de descuento (0-100)
- Retorna el precio final después de aplicar el descuento
- Si el descuento es inválido (< 0 o > 100), retorna el precio original
- Si el precio es negativo, retorna 0

**Qué aprenderemos:**
- Cómo crear un archivo de test
- Cómo escribir el primer test (caso normal)
- Cómo ejecutar el test y ver que falla
- Cómo implementar la función para que pase
- Cómo agregar más tests (edge cases)
- Cómo mejorar la implementación

**Casos a considerar:**
- ✅ Casos normales: aplicar descuentos válidos
- ✅ Edge cases: descuento 0%, descuento 100%
- ✅ Validación: descuento negativo, mayor a 100, precio negativo

---

### 👥 Ejercicio 2: Práctica guiada

**Función a probar:** `validarCuposDisponibles(capacidad, inscritos, solicitados)`

**Descripción:**
- Verifica si hay suficientes cupos disponibles en una materia
- `capacidad`: cupos totales de la materia
- `inscritos`: estudiantes ya inscritos
- `solicitados`: nuevos estudiantes que quieren inscribirse
- Retorna un objeto: `{ disponible: boolean, mensaje: string }`

**Reglas de negocio:**
- Si `inscritos + solicitados <= capacidad`: hay cupos disponibles
- Si `inscritos + solicitados > capacidad`: NO hay cupos
- Si cualquier número es negativo: error de validación
- Si `capacidad` es 0: no hay cupos disponibles

**Qué haremos juntos:**
1. Identificar qué casos probar
2. Escribir los tests paso a paso
3. Implementar la función
4. Ejecutar y verificar que todos los tests pasen

**Casos a considerar:**
- ✅ Casos normales: hay cupos, no hay cupos
- ✅ Edge cases: exactamente el último cupo, capacidad 0, sin inscritos
- ✅ Validación: números negativos

---

### 🚀 Ejercicio 3: Práctica independiente (25 min)

**Función a probar:** `calcularNotaFinal(parcial1, parcial2, final)`

**Descripción:**
Ahora les toca a ustedes! Deben escribir tests Y la implementación para una función que calcula la nota final de un estudiante.

**Reglas de negocio:**
- La nota final se calcula: `(parcial1 * 0.3) + (parcial2 * 0.3) + (final * 0.4)`
- Todas las notas deben estar entre 0 y 100
- Si alguna nota es inválida (< 0 o > 100), retornar -1
- La nota final debe redondearse a 2 decimales

**Ejemplos de uso:**
```javascript
calcularNotaFinal(80, 90, 85)  // → 85.0
calcularNotaFinal(70, 80, 90)  // → 81.0
calcularNotaFinal(100, 100, 100) // → 100.0
calcularNotaFinal(0, 0, 0)     // → 0.0
calcularNotaFinal(-10, 80, 90) // → -1 (inválido)
calcularNotaFinal(80, 110, 90) // → -1 (inválido)
```

**Instrucciones:**
1. **Paso 1 (5 min):** Piensen y escriban en papel qué casos deberían probar
2. **Paso 2 (10 min):** Escriban todos los tests
3. **Paso 3 (5 min):** Implementen la función
4. **Paso 4 (5 min):** Ejecuten los tests y corrijan si es necesario

**Casos a considerar:**
- ✅ Casos normales: varias combinaciones de notas válidas
- ✅ Edge cases: todas en 100, todas en 0, nota mínima aprobatoria
- ✅ Validación: notas negativas, mayores a 100
- ✅ Redondeo: asegurar que funcione correctamente

---

### 🎓 Reflexión final (5 min)

**Preguntas para discutir:**

1. ¿Qué aprendieron hoy sobre testing?
2. ¿Por qué creen que es útil escribir tests?
3. ¿Qué fue lo más difícil de los ejercicios?
4. ¿Cómo pueden usar esto en su proyecto de inscripciones?

**Aplicación al proyecto:**

En su proyecto de inscripciones, pueden testear funciones como:
- `validarCupos(materia)` - para verificar disponibilidad
- `verificarPrerequisitos(estudiante, materia)` - para validar requisitos
- `detectarChoqueHorarios(materias)` - para evitar conflictos
- `calcularPromedioEstudiante(notas)` - para cálculos académicos

💡 **Tip:** No necesitan testear TODO, pero sí las funciones críticas de validación.

## 🛠️ Setup rápido para testing

### Instalación (Node.js con Vitest)

```bash
npm install -D vitest
```

Agregar en `package.json`:
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

### Estructura básica de archivos

```
mi-proyecto/
├── src/
│   └── calcularPrecioFinal.js
└── tests/
    └── calcularPrecioFinal.test.js
```

---

## 📅 Próxima clase: Martes 28 de Octubre

**Tema:** Presentación Intermedia Integral

**Formato:**
- 15-20 minutos por equipo
- Demo en vivo del sistema completo
- Prueba de concurrencia en vivo

**Preparar:**
- Diagrama de arquitectura
- Datos realistas (estudiantes con histórico)
- Demo fluida y practicada
- Respuestas a posibles preguntas

---

¡Mucho éxito practicando tests!
