# Proyecto de Ejemplo: Testing de Sistema de Inscripción

Este proyecto es un ejemplo completo de cómo implementar **unit tests** e **integration tests** para un sistema de inscripción universitaria.

## 📁 Estructura del Proyecto

```
clase-07-testing/
├── src/                          # Código fuente
│   ├── validators/               # Validadores de lógica de negocio
│   │   ├── seatsValidator.js     # Validación de cupos disponibles
│   │   └── scheduleValidator.js  # Validación de choques de horario
│   ├── services/                 # Servicios de negocio
│   │   └── enrollmentService.js  # Lógica de inscripción
│   └── config/                   # Configuración (futuro)
│
├── tests/                        # Tests
│   ├── unit/                     # Unit tests (lógica aislada)
│   │   └── validators/
│   │       ├── seatsValidator.test.js       # Tests de validación de cupos
│   │       └── scheduleValidator.test.js    # Tests de validación de horarios
│   ├── integration/              # Integration tests (flujo completo)
│   │   └── enrollmentFlow.test.js           # Tests del flujo de inscripción
│   └── helpers/                  # Utilidades para tests
│       └── fixtures.js           # Datos de prueba (estudiantes, materias)
│
├── package.json                  # Dependencias del proyecto
├── jest.config.js                # Configuración de Jest
└── README.md                     # Este archivo
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

Esto instalará:
- `jest`: Framework de testing
- `@jest/globals`: Funciones globales de Jest para ES modules
- `uuid`: Para generar IDs únicos

### 2. Verificar instalación

```bash
npm test
```

Deberías ver todos los tests ejecutándose correctamente.

## 📝 Comandos Disponibles

### Comandos Básicos

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecuta todos los tests |
| `npm run test:unit` | Ejecuta solo los unit tests |
| `npm run test:integration` | Ejecuta solo los integration tests |
| `npm run test:watch` | Ejecuta tests en modo watch (se re-ejecutan al cambiar código) |
| `npm run test:coverage` | Genera reporte de cobertura de código |

### Comandos Avanzados (Desarrollo)

**Ejecutar un archivo de test específico:**

```bash
# Ejecutar solo seatsValidator.test.js
npm test tests/unit/validators/seatsValidator.test.js

# Ejecutar solo enrollmentFlow.test.js
npm test tests/integration/enrollmentFlow.test.js
```

**Ejecutar un test específico por nombre:**

```bash
# Ejecutar solo el test que contiene "should return valid when seats are available"
npm test -- -t "should return valid when seats are available"

# Ejecutar todos los tests que contienen "concurrent"
npm test -- -t "concurrent"

# Ejecutar tests que coincidan con un patrón
npm test -- -t "PENDING.*CONFIRMED"
```

**Ejecutar tests con más información (verbose):**

```bash
npm test -- --verbose
```

**Ejecutar tests y detener en el primer error:**

```bash
npm test -- --bail
```

**Combinaciones útiles:**

```bash
# Ejecutar un archivo específico en modo watch
npm test -- --watch tests/unit/validators/seatsValidator.test.js

# Ejecutar un test específico con verbose
npm test -- -t "concurrent" --verbose

# Ejecutar solo tests que fallaron en la última ejecución
npm test -- --onlyFailures
```

## 🧪 Tipos de Tests Incluidos

### Unit Tests

Los **unit tests** prueban funciones individuales de forma aislada, sin dependencias externas.

**Archivos:**
- `tests/unit/validators/seatsValidator.test.js` - 25 tests
- `tests/unit/validators/scheduleValidator.test.js` - 15 tests

**Ejemplo de unit test:**

```javascript
test('should return valid when seats are available', () => {
  const result = validateSeats({
    capacity: 10,
    enrolledCount: 8,
    requestedCount: 2
  });

  expect(result.valid).toBe(true);
  expect(result.availableSeats).toBe(2);
});
```

**Características:**
- ✅ Rápidos (milisegundos)
- ✅ No requieren base de datos
- ✅ Fáciles de debuggear
- ✅ Prueban casos edge

### Integration Tests

Los **integration tests** prueban el flujo completo desde la creación de una inscripción hasta su procesamiento.

**Archivo:**
- `tests/integration/enrollmentFlow.test.js` - 20+ tests

**Ejemplo de integration test:**

```javascript
test('should complete full enrollment flow when seats are available', async () => {
  // 1. Setup: Create course
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

  // 3. Verify PENDING status
  expect(enrollment.status).toBe('PENDING');

  // 4. Process the queue (simulate worker)
  await enrollmentService.processNextJob();

  // 5. Verify CONFIRMED status
  const processed = await db.getEnrollment(enrollment.id);
  expect(processed.status).toBe('CONFIRMED');
});
```

**Características:**
- ✅ Prueban el sistema completo
- ✅ Usan base de datos en memoria
- ✅ Validan comportamiento asíncrono
- ✅ Detectan problemas de integración

## 🎯 Escenarios de Prueba Cubiertos

### Validación de Cupos (Unit Tests)
- ✅ Cupos disponibles
- ✅ Sin cupos disponibles
- ✅ Exactamente los cupos justos
- ✅ Edge cases (capacidad 0, números negativos)
- ✅ Validación de parámetros inválidos

### Validación de Horarios (Unit Tests)
- ✅ Detección de choques de horario
- ✅ Materias en diferentes días (sin choque)
- ✅ Materias consecutivas (sin choque)
- ✅ Múltiples slots de tiempo
- ✅ Validación de inscripción masiva

### Flujo de Inscripción (Integration Tests)
- ✅ Flujo completo: PENDING → CONFIRMED
- ✅ Flujo de rechazo: PENDING → REJECTED
- ✅ Manejo de concurrencia (múltiples solicitudes)
- ✅ Idempotencia (requests duplicadas)
- ✅ Manejo de errores
- ✅ Edge cases (capacidad 0, cola vacía)

## 📊 Cobertura de Código

Para ver el reporte de cobertura:

```bash
npm run test:coverage
```

Esto generará un reporte en la carpeta `coverage/` que puedes abrir en el navegador:

```bash
open coverage/lcov-report/index.html   # En macOS
xdg-open coverage/lcov-report/index.html   # En Linux
start coverage/lcov-report/index.html  # En Windows
```

## 💡 Conceptos Clave Demostrados

### 1. Pirámide de Testing

Este proyecto sigue la pirámide de testing:
- **Base (Unit Tests):** 40 tests - rápidos, aislados, muchos
- **Medio (Integration Tests):** 20 tests - moderados, realistas
- **Cima (E2E Tests):** No incluidos en este ejemplo

### 2. Arrange-Act-Assert (AAA)

Todos los tests siguen el patrón AAA:

```javascript
test('description', () => {
  // Arrange: Setup inicial
  const input = { capacity: 10, enrolledCount: 5 };

  // Act: Ejecutar la función
  const result = validateSeats(input);

  // Assert: Verificar el resultado
  expect(result.valid).toBe(true);
});
```

### 3. Testing Asíncrono

Los integration tests demuestran cómo testear código asíncrono:

```javascript
test('async operation', async () => {
  const result = await enrollmentService.createEnrollmentRequest({
    studentId: 'student-1',
    courseId: 'course-1',
    requestId: 'req-001'
  });

  expect(result.status).toBe('PENDING');
});
```

### 4. Idempotencia

El sistema implementa idempotencia usando `requestId`:

```javascript
// Primera solicitud
const enrollment1 = await enrollmentService.createEnrollmentRequest({
  studentId: 'student-1',
  courseId: 'course-1',
  requestId: 'duplicate-req-001'
});

// Segunda solicitud con mismo requestId
const enrollment2 = await enrollmentService.createEnrollmentRequest({
  studentId: 'student-1',
  courseId: 'course-1',
  requestId: 'duplicate-req-001'
});

// Ambas devuelven la misma inscripción
expect(enrollment1.id).toBe(enrollment2.id);
```

## 🔍 Explorando el Código

### 1. Validadores (`src/validators/`)

Contienen la lógica pura de validación:
- **`seatsValidator.js`**: Valida si hay cupos disponibles
- **`scheduleValidator.js`**: Valida choques de horario

### 2. Servicios (`src/services/`)

Contienen la lógica de negocio:
- **`enrollmentService.js`**: Maneja el flujo de inscripción completo
  - Base de datos en memoria (InMemoryDatabase)
  - Creación de solicitudes
  - Procesamiento de cola
  - Idempotencia

### 3. Tests (`tests/`)

Organizados por tipo:
- **`unit/`**: Tests de funciones individuales
- **`integration/`**: Tests de flujos completos
- **`helpers/`**: Datos de prueba (fixtures)

## 🎓 Ejercicios Sugeridos

### Ejercicio 1: Agregar validación de prerequisitos

1. Crear función `validatePrerequisites(studentId, courseId)` en `src/validators/`
2. Escribir unit tests en `tests/unit/validators/`
3. Integrar en `enrollmentService.js`
4. Agregar integration test

### Ejercicio 2: Implementar waitlist

1. Modificar `enrollmentService.js` para crear inscripciones en estado `WAITLISTED`
2. Agregar lógica para promover de waitlist cuando hay cupos
3. Escribir tests para el nuevo flujo

### Ejercicio 3: Agregar más validaciones

Algunas ideas:
- Validar límite de créditos por semestre
- Validar que estudiante no esté suspendido
- Validar fecha límite de inscripción
- Validar choques con horarios personales del estudiante

## 📚 Recursos Adicionales

### Documentación

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://testingjavascript.com/)
- [Martin Fowler - Testing](https://martinfowler.com/testing/)

### Lecturas Recomendadas

- *Test Driven Development: By Example* - Kent Beck
- *Growing Object-Oriented Software, Guided by Tests* - Steve Freeman & Nat Pryce
- *The Art of Unit Testing* - Roy Osherove

## ❓ Preguntas Frecuentes

### ¿Por qué usar Jest en lugar de Mocha/Chai?

Jest es más moderno, tiene todo integrado (assertions, mocking, coverage) y es más rápido gracias a su ejecución en paralelo.

### ¿Por qué no usar una base de datos real?

Para tests, una base de datos en memoria es:
- ✅ Más rápida
- ✅ Más fácil de configurar
- ✅ No requiere infraestructura externa
- ✅ Fácil de limpiar entre tests

Para tests E2E o staging, sí usarías una base de datos real.

### ¿Cuánto coverage debo tener?

No hay un número mágico, pero:
- **80%+** es un buen objetivo
- **90%+** es excelente
- **100%** es innecesario (diminishing returns)

Lo más importante es testear **casos críticos** y **edge cases**.

### ¿Cómo debuggeo un test que falla?

**Opción 1: Ejecutar solo ese test**
```bash
# Por nombre del test
npm test -- -t "nombre del test"

# Por archivo específico
npm test tests/unit/validators/seatsValidator.test.js
```

**Opción 2: Agregar console.log**
```javascript
test('mi test', () => {
  const result = validateSeats({ capacity: 10, enrolledCount: 5 });
  console.log('Debug result:', result); // ← Agregar aquí
  expect(result.valid).toBe(true);
});
```

**Opción 3: Usar el debugger de Node.js**
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
# Luego abrir chrome://inspect en Chrome
```

**Opción 4: Modo watch + solo un archivo**
```bash
npm test -- --watch tests/unit/validators/seatsValidator.test.js
# Modifica el código y el test se re-ejecuta automáticamente
```

### ¿Cómo ejecuto solo un archivo de tests?

```bash
# Método 1: Pasar la ruta del archivo
npm test tests/unit/validators/seatsValidator.test.js

# Método 2: Usar patrón
npm test -- --testPathPattern=seatsValidator

# Método 3: En modo watch (muy útil durante desarrollo)
npm test -- --watch tests/unit/validators/seatsValidator.test.js
```

### ¿Cómo ejecuto solo un test específico dentro de un archivo?

```bash
# Usar -t (--testNamePattern) con el nombre exacto o parte del nombre
npm test -- -t "should return valid when seats are available"

# Usar regex para múltiples tests relacionados
npm test -- -t "concurrent"

# Combinar archivo + test específico
npm test tests/integration/enrollmentFlow.test.js -t "concurrent"
```

**Tip:** También puedes usar `.only` temporalmente en el código:

```javascript
// Ejecutar SOLO este test (ignorar los demás)
test.only('should return valid when seats are available', () => {
  // ...
});

// O ejecutar SOLO los tests de este describe
describe.only('Concurrency handling', () => {
  test('test 1', () => { /* ... */ });
  test('test 2', () => { /* ... */ });
});
```

**⚠️ Importante:** Recuerda quitar `.only` antes de hacer commit!

## 🤝 Contribuciones

Este es un proyecto de ejemplo con fines educativos. Si encuentras errores o mejoras, ¡siéntete libre de hacer un fork y experimentar!

## 📄 Licencia

MIT - Libre para uso educativo y comercial.

---

**Creado para el curso de Tópicos Avanzados - UAGRM 2025**

¡Feliz testing! 🧪✨
