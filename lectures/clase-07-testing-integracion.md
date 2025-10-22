# 📆 (Clase 7) Jueves 23 de Octubre – Testing e Integración

---

# Revisión del día

- Unit tests de validación de cupo implementados.
- Verificación de cobertura básica de tests.
- Preparación para integración completa del sistema.

---

## 📚 Conceptos clave

### 1. Pirámide de Testing (repaso)

La pirámide de testing es un modelo que nos ayuda a entender qué tipos de tests debemos escribir y en qué proporción:

```
                    /\
                   /  \
                  / E2E \          ← Pocas pruebas, lentas, costosas
                 /--------\
                /          \
               / Integration \     ← Cantidad moderada, validan interacciones
              /--------------\
             /                \
            /   Unit Tests     \   ← Muchas pruebas, rápidas, baratas
           /____________________\
```

**Características de cada nivel:**

| Tipo | Velocidad | Cobertura | Cantidad | Propósito |
|------|-----------|-----------|----------|-----------|
| **Unit Tests** | Muy rápidas | Baja (una función/clase) | Muchas (70%) | Validar lógica aislada |
| **Integration Tests** | Moderadas | Media (múltiples componentes) | Moderadas (20%) | Validar interacciones entre componentes |
| **E2E Tests** | Lentas | Alta (sistema completo) | Pocas (10%) | Validar flujos de usuario completos |

### 2. Unit Tests vs Integration Tests

**Unit Tests:**
- Prueban **una unidad de código aislada** (función, método, clase)
- Usan **mocks** para las dependencias externas
- Son **rápidas** y **predecibles**
- Ejemplo: probar la función de validación de cupos sin tocar la base de datos

**Integration Tests:**
- Prueban **la integración entre múltiples componentes**
- Usan **dependencias reales** o simuladas (bases de datos de prueba, colas reales)
- Son **más lentas** pero más realistas
- Ejemplo: probar el flujo completo desde que llega una request HTTP hasta que se actualiza la base de datos

**Comparación visual:**

```
Unit Test:
┌─────────────────────┐
│ validateSeats()     │  ← Función aislada
│                     │
│ Input: capacity=10  │
│        enrolled=8   │
│        requested=3  │
│                     │
│ Output: false       │
└─────────────────────┘

Integration Test:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   HTTP POST  │───▶│  Controller  │───▶│   Service    │───▶│   Database   │
│ /api/enroll  │    │              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                    │
                    ┌───────────────────────────────────────────────┘
                    │
                    ▼
            ┌──────────────┐    ┌──────────────┐
            │     Queue    │───▶│    Worker    │
            │              │    │              │
            └──────────────┘    └──────────────┘
```

---

### 3. Testing de flujos asíncronos

El sistema de inscripción que estamos construyendo tiene procesamiento asíncrono mediante colas y workers. Esto introduce desafíos específicos en el testing:

**Desafíos:**
1. **No determinismo temporal:** no sabemos cuándo exactamente el worker procesará la solicitud
2. **Estado eventual:** el sistema pasa por estados intermedios (PENDING) antes de llegar al estado final
3. **Concurrencia:** múltiples solicitudes procesándose simultáneamente

**Estrategias para testear flujos asíncronos:**

#### A. Polling con timeout

Esperar activamente hasta que la condición se cumpla, con un timeout máximo:

```javascript
async function waitForEnrollmentStatus(enrollmentId, expectedStatus, timeoutMs = 5000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const enrollment = await db.getEnrollment(enrollmentId);
    if (enrollment.status === expectedStatus) {
      return enrollment;
    }
    await sleep(100); // esperar 100ms antes de reintentar
  }

  throw new Error(`Timeout waiting for status ${expectedStatus}`);
}

// En el test:
test('enrollment should be confirmed when seats available', async () => {
  const enrollmentId = await createEnrollmentRequest(studentId, courseId);

  // Esperar hasta que el worker procese la solicitud
  const enrollment = await waitForEnrollmentStatus(enrollmentId, 'CONFIRMED', 5000);

  expect(enrollment.status).toBe('CONFIRMED');
});
```

#### B. Eventos o callbacks

Escuchar eventos emitidos por el sistema:

```javascript
test('enrollment should emit event when confirmed', async (done) => {
  eventBus.once('enrollment.confirmed', (data) => {
    expect(data.studentId).toBe(studentId);
    expect(data.courseId).toBe(courseId);
    done();
  });

  await createEnrollmentRequest(studentId, courseId);
});
```

#### C. Procesar la cola de forma síncrona en tests

Ejecutar el worker inmediatamente en lugar de esperar:

```javascript
test('enrollment should be confirmed when processed', async () => {
  const enrollmentId = await createEnrollmentRequest(studentId, courseId);

  // En lugar de esperar al worker, procesamos inmediatamente en el test
  await worker.processNextJob();

  const enrollment = await db.getEnrollment(enrollmentId);
  expect(enrollment.status).toBe('CONFIRMED');
});
```

---

### 4. Mocking de servicios externos

**¿Qué es un mock?**

Un **mock** es un objeto falso que simula el comportamiento de un objeto real. Los mocks son fundamentales en unit testing porque nos permiten:
- Aislar la unidad que estamos probando
- Controlar el comportamiento de las dependencias
- Verificar que se llamen los métodos correctos

**Tipos de doubles:**

- **Stub:** retorna valores predefinidos
- **Mock:** verifica que se llamen métodos específicos
- **Spy:** registra llamadas pero delega al objeto real
- **Fake:** implementación simplificada (ej: base de datos en memoria)

**Ejemplo de mock en Jest:**

```javascript
// courseService.js
class CourseService {
  async getCourse(courseId) {
    // Consulta real a la base de datos
    return await db.courses.findById(courseId);
  }

  async getEnrolledCount(courseId) {
    return await db.enrollments.count({ courseId, status: 'CONFIRMED' });
  }
}

// enrollmentService.test.js
import { jest } from '@jest/globals';
import { EnrollmentService } from './enrollmentService.js';
import { CourseService } from './courseService.js';

// Mock del CourseService
jest.mock('./courseService.js');

test('should reject enrollment when course is full', async () => {
  // Configurar el mock para retornar datos específicos
  CourseService.prototype.getCourse.mockResolvedValue({
    id: 'course-1',
    name: 'Math 101',
    capacity: 10
  });

  CourseService.prototype.getEnrolledCount.mockResolvedValue(10); // curso lleno

  const enrollmentService = new EnrollmentService();
  const result = await enrollmentService.validateEnrollment('student-1', 'course-1');

  expect(result.valid).toBe(false);
  expect(result.error).toBe('NO_CAPACITY');
});
```

**Ejemplo con implementación manual (sin framework):**

```javascript
// Mock manual
class MockCourseService {
  constructor(mockData) {
    this.mockData = mockData;
  }

  async getCourse(courseId) {
    return this.mockData.courses[courseId];
  }

  async getEnrolledCount(courseId) {
    return this.mockData.enrolledCounts[courseId] || 0;
  }
}

// En el test
test('should reject enrollment when course is full', async () => {
  const mockCourseService = new MockCourseService({
    courses: {
      'course-1': { id: 'course-1', name: 'Math 101', capacity: 10 }
    },
    enrolledCounts: {
      'course-1': 10 // curso lleno
    }
  });

  const enrollmentService = new EnrollmentService(mockCourseService);
  const result = await enrollmentService.validateEnrollment('student-1', 'course-1');

  expect(result.valid).toBe(false);
  expect(result.error).toBe('NO_CAPACITY');
});
```

---

### 5. Preparación de datos realistas para testing

Para que la demo final sea convincente, necesitamos datos realistas que simulen un sistema universitario real.

**Estructura de datos recomendada:**

```javascript
// Datos de ejemplo para el sistema
const mockData = {
  students: [
    {
      id: 'st-001',
      name: 'Juan Pérez',
      email: 'juan.perez@uagrm.edu',
      enrollmentYear: 2022,
      totalCredits: 85
    }
  ],

  courses: [
    {
      id: 'cs-101',
      code: 'CS-101',
      name: 'Programación I',
      credits: 8,
      capacity: 30,
      schedule: [
        { day: 'monday', startTime: '08:00', endTime: '10:00' },
        { day: 'wednesday', startTime: '08:00', endTime: '10:00' }
      ],
      prerequisites: []
    },
    {
      id: 'cs-201',
      code: 'CS-201',
      name: 'Programación II',
      credits: 8,
      capacity: 25,
      schedule: [
        { day: 'tuesday', startTime: '10:00', endTime: '12:00' },
        { day: 'thursday', startTime: '10:00', endTime: '12:00' }
      ],
      prerequisites: ['cs-101']
    }
  ],

  studentHistory: [
    {
      studentId: 'st-001',
      courseId: 'cs-101',
      semester: '2023-1',
      grade: 85,
      status: 'APPROVED',
      credits: 8
    },
    {
      studentId: 'st-001',
      courseId: 'math-101',
      semester: '2023-1',
      grade: 72,
      status: 'APPROVED',
      credits: 6
    },
    {
      studentId: 'st-001',
      courseId: 'physics-101',
      semester: '2023-2',
      grade: 45,
      status: 'FAILED',
      credits: 0
    }
  ]
};
```

**Script para generar datos de prueba:**

Ver ejemplo completo en: `examples/clase-07-testing/seedData.js` (lo crearemos después)

**Características de buenos datos de prueba:**
- ✅ Realistas (nombres, códigos de materia, horarios plausibles)
- ✅ Diversos (estudiantes con diferentes historiales)
- ✅ Edge cases (estudiantes con materias reprobadas, sin prerequisitos, etc.)
- ✅ Suficientes para demostrar concurrencia (múltiples estudiantes y materias)

---

## 💻 Ejemplos de código

### Ejemplo 1: Unit test de validación de cupos

**Archivo:** `examples/clase-07-testing/unitTests/validateSeats.test.js`

Este ejemplo mostrará cómo testear la lógica de validación de cupos de forma aislada:

```javascript
// validateSeats.test.js
import { validateSeats } from '../src/validators/seatsValidator.js';

describe('validateSeats', () => {
  test('should return true when seats are available', () => {
    const result = validateSeats({
      capacity: 10,
      enrolledCount: 8,
      requestedCount: 2
    });

    expect(result.valid).toBe(true);
  });

  test('should return false when seats are not available', () => {
    const result = validateSeats({
      capacity: 10,
      enrolledCount: 8,
      requestedCount: 3
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe('NO_CAPACITY');
  });

  test('should handle edge case when exactly enough seats', () => {
    const result = validateSeats({
      capacity: 10,
      enrolledCount: 8,
      requestedCount: 2
    });

    expect(result.valid).toBe(true);
  });

  test('should handle edge case when course is already full', () => {
    const result = validateSeats({
      capacity: 10,
      enrolledCount: 10,
      requestedCount: 1
    });

    expect(result.valid).toBe(false);
  });
});
```

**Lo que aprenderemos:**
- Cómo estructurar unit tests con `describe` y `test`
- Cómo usar `expect` para hacer aserciones
- Cómo probar casos normales y edge cases
- Cómo testear lógica pura sin dependencias externas

---

### Ejemplo 2: Integration test del flujo de inscripción

**Archivo:** `examples/clase-07-testing/integrationTests/enrollmentFlow.test.js`

Este ejemplo mostrará cómo testear el flujo completo desde la API hasta la base de datos:

```javascript
// enrollmentFlow.test.js
import request from 'supertest';
import { app } from '../src/app.js';
import { setupTestDatabase, cleanupTestDatabase } from './helpers/testDb.js';
import { processQueue } from '../src/workers/enrollmentWorker.js';

describe('Enrollment Flow Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('should complete full enrollment flow: request → pending → confirmed', async () => {
    // 1. Crear materia con cupos disponibles
    const course = await db.courses.create({
      id: 'test-course-1',
      name: 'Test Course',
      capacity: 10,
      enrolledCount: 0
    });

    const student = await db.students.create({
      id: 'test-student-1',
      name: 'Test Student'
    });

    // 2. Hacer request HTTP para inscribirse
    const response = await request(app)
      .post('/api/enroll')
      .send({
        studentId: student.id,
        courseId: course.id,
        requestId: 'test-req-001'
      })
      .expect(201);

    // 3. Verificar que se creó en estado PENDING
    expect(response.body.success).toBe(true);
    expect(response.body.enrollment.status).toBe('PENDING');

    const enrollmentId = response.body.enrollment.id;

    // 4. Procesar la cola (simular worker)
    await processQueue();

    // 5. Verificar que cambió a CONFIRMED
    const enrollment = await db.enrollments.findById(enrollmentId);
    expect(enrollment.status).toBe('CONFIRMED');

    // 6. Verificar que el contador de inscritos aumentó
    const updatedCourse = await db.courses.findById(course.id);
    expect(updatedCourse.enrolledCount).toBe(1);
  });

  test('should reject enrollment when course is full', async () => {
    // 1. Crear materia llena
    const course = await db.courses.create({
      id: 'test-course-2',
      name: 'Full Course',
      capacity: 10,
      enrolledCount: 10 // ya lleno
    });

    const student = await db.students.create({
      id: 'test-student-2',
      name: 'Test Student 2'
    });

    // 2. Intentar inscribirse
    const response = await request(app)
      .post('/api/enroll')
      .send({
        studentId: student.id,
        courseId: course.id,
        requestId: 'test-req-002'
      })
      .expect(201);

    const enrollmentId = response.body.enrollment.id;

    // 3. Procesar la cola
    await processQueue();

    // 4. Verificar que fue rechazada
    const enrollment = await db.enrollments.findById(enrollmentId);
    expect(enrollment.status).toBe('REJECTED');
    expect(enrollment.rejectionReason).toBe('NO_CAPACITY');
  });

  test('should handle concurrent requests correctly', async () => {
    // 1. Crear materia con pocos cupos
    const course = await db.courses.create({
      id: 'test-course-3',
      name: 'Limited Course',
      capacity: 5,
      enrolledCount: 0
    });

    // 2. Crear 10 estudiantes
    const students = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        db.students.create({
          id: `concurrent-student-${i}`,
          name: `Concurrent Student ${i}`
        })
      )
    );

    // 3. Todos intentan inscribirse al mismo tiempo
    const requests = students.map((student, i) =>
      request(app)
        .post('/api/enroll')
        .send({
          studentId: student.id,
          courseId: course.id,
          requestId: `concurrent-req-${i}`
        })
    );

    const responses = await Promise.all(requests);

    // Todos deberían recibir estado 201 (creados en PENDING)
    responses.forEach(res => {
      expect(res.status).toBe(201);
    });

    // 4. Procesar toda la cola
    await processQueue();

    // 5. Verificar que solo 5 fueron confirmadas
    const confirmedCount = await db.enrollments.count({
      courseId: course.id,
      status: 'CONFIRMED'
    });

    const rejectedCount = await db.enrollments.count({
      courseId: course.id,
      status: 'REJECTED'
    });

    expect(confirmedCount).toBe(5); // capacidad máxima
    expect(rejectedCount).toBe(5);  // resto rechazado

    // 6. Verificar que no se excedió la capacidad
    const updatedCourse = await db.courses.findById(course.id);
    expect(updatedCourse.enrolledCount).toBe(5);
  });
});
```

**Lo que aprenderemos:**
- Cómo configurar y limpiar base de datos de prueba
- Cómo testear endpoints HTTP con `supertest`
- Cómo simular procesamiento asíncrono en tests
- Cómo testear concurrencia y race conditions
- Cómo verificar que el sistema mantiene integridad de datos

---

## 🛠️ Setup de entorno de testing

### Herramientas recomendadas

**Para Node.js:**
- **Jest** o **Vitest**: framework de testing moderno
- **Supertest**: para testear APIs HTTP
- **Testcontainers** (opcional): para bases de datos reales en contenedores

**Para Python:**
- **pytest**: framework de testing
- **pytest-asyncio**: para tests asíncronos
- **httpx**: para testear APIs

**Para Java:**
- **JUnit 5**: framework de testing
- **Mockito**: para mocking
- **TestContainers**: para bases de datos en contenedores

### Estructura de carpetas recomendada

```
project/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── validators/
│   └── workers/
├── tests/
│   ├── unit/
│   │   ├── validators/
│   │   │   └── seatsValidator.test.js
│   │   └── services/
│   │       └── enrollmentService.test.js
│   ├── integration/
│   │   ├── enrollmentFlow.test.js
│   │   └── concurrencyFlow.test.js
│   └── helpers/
│       ├── testDb.js
│       └── fixtures.js
└── package.json
```

---

## 📋 Checklist para la clase siguiente (Martes 28 Oct)

Cada equipo debe tener listo:

### Backend
- [ ] **Integration tests implementados:**
  - Test del flujo PENDING → CONFIRMED
  - Test del flujo PENDING → REJECTED (cupo lleno)
  - Test de concurrencia (múltiples solicitudes simultáneas)

- [ ] **Datos de prueba realistas:**
  - Al menos 5 estudiantes con diferentes historiales
  - Al menos 10 materias con diferentes horarios y prerequisitos
  - Histórico de notas (aprobadas, reprobadas, en curso)

- [ ] **Microservicios integrados:**
  - Servicio de autenticación (aunque sea simulado)
  - Servicio de estudiantes
  - Servicio de materias
  - Servicio de inscripciones
  - Sistema de colas funcionando
  - Workers procesando correctamente

- [ ] **Validaciones completas:**
  - Validación de cupos
  - Validación de horarios
  - Validación de prerequisitos

### Frontend (Web y Mobile)
- [ ] **Perfil de estudiante completo:**
  - Datos personales
  - Histórico de materias cursadas por semestre
  - Notas (con promedio calculado)
  - Créditos acumulados

- [ ] **Flujo de inscripción completo:**
  - Ver catálogo de materias disponibles
  - Filtrar por horario/prerequisitos
  - Seleccionar múltiples materias
  - Ver validación en tiempo real
  - Confirmar inscripción
  - Ver estado (PENDING → CONFIRMED/REJECTED)

- [ ] **Manejo de errores claro:**
  - Cupo lleno
  - Choque de horario (indicar con qué materia)
  - Prerequisito no cumplido

### Integración
- [ ] **Diagrama de arquitectura preparado:**
  - Microservicios y sus responsabilidades
  - Sistema de colas
  - Flujo de datos

- [ ] **Demo de concurrencia lista:**
  - Script o herramienta para simular múltiples usuarios
  - Materia con cupos limitados
  - Verificación de que no se excedan los cupos

---

## 🎯 Actividad de clase

### Actividad 1: Implementar unit test de validación de cupos (15 min)

**Objetivo:** Cada equipo debe implementar al menos un unit test de la función de validación de cupos.

**Pasos:**
1. Identificar la función que valida cupos en su proyecto
2. Escribir al menos 3 test cases:
   - Caso con cupos disponibles
   - Caso sin cupos disponibles
   - Caso edge (exactamente el último cupo)
3. Ejecutar los tests y verificar que pasen

### Actividad 2: Planificar integration tests (20 min)

**Objetivo:** Diseñar los integration tests que implementarán durante la semana.

**Pasos:**
1. Identificar los 3 flujos más críticos del sistema
2. Para cada flujo, definir:
   - Estado inicial (setup)
   - Acciones a ejecutar
   - Estado esperado (assertions)
3. Compartir con el profesor para feedback

### Actividad 3: Preparar datos realistas (25 min)

**Objetivo:** Crear datos de prueba que usarán en la demo final.

**Pasos:**
1. Diseñar el perfil de al menos 2 estudiantes con historiales diferentes:
   - Uno con buen historial (todas aprobadas)
   - Uno con historial mixto (algunas reprobadas)
2. Crear al menos 5 materias con horarios y prerequisitos
3. Insertar estos datos en la base de datos de desarrollo

---

## 📚 Referencias y recursos

### Documentación oficial
- [Jest - Getting Started](https://jestjs.io/docs/getting-started)
- [Vitest - Guide](https://vitest.dev/guide/)
- [pytest Documentation](https://docs.pytest.org/)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)

### Artículos recomendados
- Fowler, Martin. ["TestPyramid"](https://martinfowler.com/bliki/TestPyramid.html)
- Fowler, Martin. ["Mocks Aren't Stubs"](https://martinfowler.com/articles/mocksArentStubs.html)
- ["The Practical Test Pyramid"](https://martinfowler.com/articles/practical-test-pyramid.html) por Ham Vocke

### Libros
- *Growing Object-Oriented Software, Guided by Tests* - Steve Freeman & Nat Pryce
- *Test Driven Development: By Example* - Kent Beck
- *Working Effectively with Legacy Code* - Michael Feathers

---

## 🤔 Preguntas frecuentes

### ¿Cuántos tests debo escribir?

**Regla general:**
- **Unit tests:** tantos como funciones críticas tengas. Enfócate en lógica de negocio.
- **Integration tests:** al menos 1 por cada flujo crítico (3-5 tests)
- **E2E tests:** 1-2 tests del flujo más importante (opcional para este proyecto)

### ¿Debo testear todo?

No. Enfócate en:
- ✅ Lógica de negocio (validaciones, cálculos)
- ✅ Flujos críticos (inscripción, manejo de concurrencia)
- ✅ Edge cases (límites, casos especiales)

No es necesario testear:
- ❌ Getters/setters triviales
- ❌ Código de terceros (frameworks, librerías)
- ❌ Configuración simple

### ¿Cómo testeo código asíncrono?

Usa `async/await` en tus tests:

```javascript
test('async operation', async () => {
  const result = await myAsyncFunction();
  expect(result).toBe(expectedValue);
});
```

O usa callbacks/promises según el framework que uses.

### ¿Qué hago si mis tests son lentos?

**Optimizaciones:**
1. Usa base de datos en memoria (SQLite) en lugar de PostgreSQL/MySQL
2. No limpies toda la DB entre tests, solo las tablas necesarias
3. Agrupa tests relacionados para reusar setup
4. Ejecuta tests en paralelo si es posible

### ¿Debo usar una base de datos real o en memoria para integration tests?

**Depende del tiempo y recursos:**

**Opción 1 - Base de datos en memoria (más fácil):**
- ✅ Rápida y simple de configurar
- ✅ No requiere Docker o servicios externos
- ❌ No prueba queries específicas de PostgreSQL/MySQL

**Opción 2 - Base de datos real con Docker (más realista):**
- ✅ Prueba el sistema como en producción
- ✅ Detecta problemas específicos de la base de datos
- ❌ Más lenta
- ❌ Requiere Docker

**Recomendación para este proyecto:** Usa opción 1 (en memoria) por simplicidad.

---

## 💡 Consejos para la presentación intermedia

### 1. Practica el flujo completo antes

No improvises en la presentación. Practica al menos 2-3 veces el flujo completo de la demo para evitar sorpresas.

### 2. Ten datos de respaldo

Si algo falla durante la demo, ten capturas de pantalla o un video grabado como respaldo.

### 3. Explica las decisiones técnicas

No solo muestres que funciona, explica **por qué** elegiste esa arquitectura o tecnología.

### 4. Sé honesto sobre limitaciones

Si algo no está implementado o tiene bugs conocidos, menciónalo. Es mejor ser transparente.

### 5. Prepara respuestas a preguntas comunes

Anticipa preguntas como:
- ¿Por qué usaste esa tecnología de colas?
- ¿Cómo manejas la concurrencia?
- ¿Qué pasa si el worker se cae?
- ¿Cómo escalas el sistema?

---

## 🎓 Conclusión

El testing es fundamental para garantizar que nuestro sistema funciona correctamente, especialmente cuando hay concurrencia y estado asíncrono. Los **unit tests** nos dan confianza en la lógica aislada, mientras que los **integration tests** nos aseguran que los componentes trabajan juntos correctamente.

**Principios clave:**
1. ✅ Sigue la pirámide de testing (muchos unit, pocos integration, muy pocos E2E)
2. ✅ Testea casos normales y edge cases
3. ✅ Usa mocks para aislar unit tests
4. ✅ Usa bases de datos de prueba para integration tests
5. ✅ Prepara datos realistas para la demo final

La clase siguiente (Martes 28) será la **presentación intermedia**. Asegúrate de tener el sistema funcionando end-to-end con datos realistas.

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

¡Mucho éxito con la implementación!
