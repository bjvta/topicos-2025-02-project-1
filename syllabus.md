# Tópicos 2025 semestre 2

# 📚 Proyecto de Inscripción Universitaria – Cronograma Octubre 2025

---

## 📊 Sistema de Evaluación

El proyecto de este mes se evalúa de la siguiente manera:

### Distribución de la Nota (100%)

| Componente | Porcentaje | Fecha | Descripción |
|------------|-----------|-------|-------------|
| **Presentación Intermedia** | 25% | 16 de Octubre | Demo de Web/Mobile con validaciones completas |
| **Presentación Final** | 25% | 30 de Octubre | Proyecto completo con deploy en cloud y pruebas JMeter |
| **Tareas y Actividades** | 50% | Cada clase | Entregables semanales + participación en clase |

### Desglose de Tareas y Actividades (50%)

Cada clase incluye:
- **Tarea semanal**: Entregable mínimo obligatorio para la siguiente clase
- **Actividad en clase**: Participación y desarrollo durante la sesión

Las tareas se revisan en la siguiente clase según el cronograma detallado abajo.

### Fechas Clave

- **16 de Octubre**: Primera evaluación formal (25%)
  - Presentación refinada de Web/Mobile
  - Validaciones de negocio implementadas

- **30 de Octubre**: Evaluación final (25%)
  - Sistema completo funcionando
  - Deploy en la nube
  - Resultados de pruebas de carga con JMeter

**Nota importante**: Las tareas no entregadas a tiempo afectan directamente el 50% de tareas y actividades.

---

## 📆 Jueves 2 de Octubre

**Revisión del día:**

- Tarea pendiente que dejó el ingeniero Peinado.

**Conceptos a ver en clase:**

- Cupos limitados y concurrencia.
- Patrón *Producer–Consumer* con colas.
- Race conditions y cómo evitarlas.
- Idempotencia (`requestId`) para evitar duplicados.
- Backpressure (qué pasa si el worker no da abasto).

**Mínimo obligatorio para la siguiente clase (Martes 7 Oct):**

- Implementar flujo `SeatRequested → SeatConfirmed/Rejected`.
- Worker procesa solicitudes en orden (ejemplo: 20 → 10 cupos).

**Opcional:**

- Implementar lista de espera (waitlist).
- Idempotencia con `requestId`.

**Entregable a revisar el 7 Oct:**

- API maneja concurrencia con cupos limitados.
- Se valida que no se rompan los cupos al simular concurrencia.

---

## 📆 Martes 7 de Octubre

**Revisión del día:**

- Flujo `SeatRequested → SeatConfirmed/Rejected` implementado.
- Worker procesando solicitudes en orden.
- Validación de cupos en concurrencia.

**Conceptos a ver en clase:**

- Cómo reflejar procesos asincrónicos en UI.
- Estados en la inscripción: *Pending*, *Confirmed*, *Rejected*.
- Diferencia entre inscripción inmediata (síncrona) y encolada (asíncrona).
- Estrategias: **Polling vs WebSockets vs SSE**.

**Mínimo obligatorio para la siguiente clase (Jueves 9 Oct):**

- Conectar el flujo real al cliente Web.
- Mostrar en la UI el estado de inscripción: *Pending*, *Confirmed*, *Rejected*.

**Opcional:**

- Notificaciones visuales (alertas/spinners).
- Estado en tiempo real con Polling o WebSocket.

**Entregable a revisar el 9 Oct:**

- Cliente Web mostrando estados de inscripción correctamente.

---

## 📆 Jueves 9 de Octubre

**Revisión del día:**

- Cliente Web conectado al backend.
- La UI muestra los estados de inscripción: *Pending*, *Confirmed* y *Rejected*.

**Conceptos a ver en clase:**

- Concurrencia y consistencia desde el lado **móvil**.
- Problemas típicos: toques múltiples, red inestable.
- Estrategias: **Optimistic UI**, **Retry strategy**, **Idempotencia en cliente**.

**Mínimo obligatorio para la siguiente clase (Martes 14 Oct):**

- Implementar cliente **Mobile MVP**: login (simulado), ver materias, inscribirse, ver estado.

**Opcional:**

- Persistencia local de sesión en el dispositivo.
- Optimistic UI con rollback.
- Mejoras visuales.

**Entregable a revisar el 14 Oct:**

- Mobile MVP funcionando y mostrando estado.

---

## 📆 Martes 14 de Octubre — Mini Presentación Web/Mobile

**Revisión del día:**

- Flujo de inscripción funcionando en Web y Mobile.

**Conceptos a ver en clase:**

- Estado eventual: cómo comunicar *Pending*.
- Manejo de errores: cupo lleno, choque de horario.
- Logs con `requestId` para trazabilidad.

**Mínimo obligatorio para la siguiente clase (Jueves 16 Oct):**

- Validar choques de horario en backend.
- Mostrar mensajes de error claros en UI.

**Opcional:**

- Desinscripción.
- Historial de inscripciones.

**Entregable a revisar el 16 Oct:**

- Web/Mobile refinados con validaciones y mensajes claros.

---

## 📆 Jueves 16 de Octubre — Presentación refinada

**Revisión del día:**

- Validar choques y cupos en Web/Mobile.

**Conceptos a ver en clase:**

- Atomicidad en inscripciones múltiples.
- Tolerancia a fallos: retries, circuit breakers.
- Idempotencia end-to-end.

---

## 📆 Martes 21 de Octubre — Unit Test básico

**Revisión del día:**

- Grupos que quedaron pendientes de la presentación de la clase anterior

**Conceptos a ver en clase:**

- Unit Test
- Pirámide de Test

**Mínimo obligatorio para la siguiente clase (Jueves 23 Oct):**

- El test case the validación de cupo

**Opcional:**

- Unit tests de la función de inscripción

**Entregable a revisar el 23 Oct:**

- Unit test de la validación de cupo

---

## 📆 Jueves 23 de Octubre — Integración y Testing Avanzado

**Revisión del día:**

- Unit tests de validación de cupo implementados.
- Verificar cobertura de tests básica.

**Conceptos a ver en clase:**

- Integration Tests: pruebas end-to-end del flujo completo
- Testing del flujo asíncrono (colas y workers)
- Mocking de servicios externos
- Preparación de datos realistas para la demo final
- **Opcional:** Deploy en cloud (PaaS/IaaS) y Kubernetes básico

**Mínimo obligatorio para la siguiente clase (Martes 28 Oct):**

- Integration tests del flujo de inscripción completo
- Datos de prueba realistas: estudiantes con histórico de notas y materias cursadas
- Backend con todos los conceptos integrados:
  - Microservicios funcionando
  - Colas procesando solicitudes
  - Workers manejando concurrencia
  - Validaciones completas (cupos, horarios, prerequisitos)
- Preparar arquitectura (diagrama simple) del sistema completo

**Opcional:**

- Deploy en cloud con URL pública
- Tests de carga con JMeter
- Subir microservicios en Kubernetes (minikube/kind)
- Métricas y observabilidad

**Entregable a revisar el 28 Oct:**

- Sistema funcionando con integración completa
- Demo preparada con datos realistas

---

## 📆 Martes 28 de Octubre — Presentación Intermedia Integral

**Revisión del día:**

- Presentación de cada equipo (15-20 min por equipo)
- Demostración del sistema completo funcionando

**Formato de presentación:**

Cada equipo debe mostrar:

1. **Arquitectura del sistema** (5 min)
   - Diagrama de microservicios
   - Explicar cómo se comunican (APIs, colas, eventos)
   - Mostrar dónde están implementados los conceptos clave:
     - Colas (producer-consumer)
     - Workers (procesamiento asíncrono)
     - Manejo de concurrencia
     - Idempotencia

2. **Demo Backend** (5 min)
   - Mostrar flujo asíncrono funcionando (PENDING → CONFIRMED/REJECTED)
   - Demostrar manejo de concurrencia (múltiples solicitudes simultáneas)
   - Mostrar logs con requestId para trazabilidad
   - Validaciones de negocio (cupos, horarios, prerequisitos)

3. **Demo Frontend (Web + Mobile)** (5 min)
   - Cliente Web: flujo completo de inscripción
   - Cliente Mobile: mismo flujo en dispositivo móvil
   - Mostrar estudiante con:
     - Histórico de materias cursadas
     - Notas previas (simuladas de forma realista)
     - Inscripción en nuevas materias
     - Estados asíncronos claros (PENDING, CONFIRMED, REJECTED)

4. **Prueba de concurrencia en vivo** (3-5 min)
   - Simular 10-20 usuarios intentando inscribirse simultáneamente
   - Materia con cupos limitados (ej: 5 cupos para 15 solicitudes)
   - Verificar que solo se confirmen los cupos disponibles

**Mínimo obligatorio para la siguiente clase (Jueves 30 Oct):**

- Incorporar feedback de la presentación intermedia
- Pulir la experiencia de usuario (UX) en Web y Mobile
- Agregar más datos realistas al sistema
- Preparar demo final más fluida y profesional
- Documentar decisiones técnicas tomadas

**Opcional:**

- Deploy en cloud con URL pública
- Waitlist funcional
- Notificaciones en tiempo real (WebSockets/SSE)
- Dashboard con métricas visuales
- Tests de carga con JMeter (reporte de resultados)

**Entregable a revisar el 30 Oct:**

- Demo final pulida y profesional

---

## 📆 Jueves 30 de Octubre — Presentación Final y Evaluación

**Revisión del día:**

- Presentaciones finales de cada equipo (20-25 min por equipo)
- Evaluación final del proyecto (25% de la nota)

**Formato de presentación final:**

Cada equipo debe presentar:

### 1. Introducción y contexto (2 min)
- Presentación del equipo
- Visión general del sistema de inscripción universitaria

### 2. Demostración completa del sistema (10 min)

**Simulación de caso real:**
- Mostrar un estudiante iniciando sesión en el sistema
- Ver su perfil con:
  - Histórico completo de materias cursadas
  - Notas de semestres anteriores (datos realistas)
  - Materias aprobadas y reprobadas
  - Créditos acumulados
- Proceso de inscripción paso a paso:
  - Navegar catálogo de materias disponibles
  - Ver horarios y cupos disponibles
  - Seleccionar múltiples materias
  - Sistema valida automáticamente:
    - Prerequisitos cumplidos
    - Sin choques de horario
    - Cupos disponibles
  - Enviar solicitud y ver estado PENDING
  - Mostrar transición a CONFIRMED/REJECTED
  - Ver inscripciones confirmadas en el perfil

**Demo en ambos clientes:**
- Mismo flujo funcionando en Web
- Mismo flujo funcionando en Mobile
- Consistencia entre ambas plataformas

### 3. Arquitectura técnica (5 min)

**Backend:**
- Diagrama de microservicios completo
- Explicación de:
  - API Gateway y servicios independientes
  - Sistema de colas (implementación específica usada)
  - Workers y procesamiento asíncrono
  - Base de datos y modelo de datos
  - Manejo de concurrencia con cupos limitados

**Conceptos implementados:**
- ✅ Colas (producer-consumer pattern)
- ✅ Hilos/workers (procesamiento concurrente)
- ✅ Microservicios (separación de responsabilidades)
- ✅ Comunicación asíncrona
- ✅ Idempotencia (requestId)
- ✅ Validaciones de negocio (cupos, horarios, prerequisitos)
- ✅ Estado eventual (PENDING → CONFIRMED/REJECTED)
- ✅ Manejo de errores robusto
- ✅ Tests (unitarios e integración)

### 4. Prueba de concurrencia en vivo (3 min)
- Demostración real con múltiples usuarios simultáneos
- Ejemplo: 20 solicitudes → 10 cupos disponibles
- Verificar que el sistema respeta los límites
- Mostrar logs con trazabilidad (requestId)

### 5. Decisiones técnicas y aprendizajes (3 min)
- Desafíos enfrentados y cómo se resolvieron
- Trade-offs considerados
- Qué aprendieron del proyecto
- Qué mejorarían con más tiempo

### 6. Q&A (2-5 min)
- Preguntas del profesor y compañeros

**Checklist de evaluación (lo que se revisará):**

**Backend (40%):**
- [ ] Microservicios implementados y funcionando
- [ ] Sistema de colas procesando solicitudes
- [ ] Workers manejando concurrencia correctamente
- [ ] Validaciones completas (cupos, horarios, prerequisitos)
- [ ] Idempotencia implementada (requestId)
- [ ] Manejo de estados asíncronos (PENDING → CONFIRMED/REJECTED)
- [ ] Logs con trazabilidad
- [ ] Tests implementados

**Frontend Web (20%):**
- [ ] Interfaz funcional y usable
- [ ] Flujo completo de inscripción
- [ ] Estados asíncronos claros
- [ ] Datos realistas (histórico, notas)
- [ ] Manejo de errores apropiado

**Frontend Mobile (20%):**
- [ ] App funcional en dispositivo móvil
- [ ] Mismo flujo que Web
- [ ] Experiencia de usuario apropiada para móvil
- [ ] Consistencia con la versión Web

**Integración y Demo (20%):**
- [ ] Sistema funcionando end-to-end
- [ ] Prueba de concurrencia exitosa
- [ ] Presentación clara y profesional
- [ ] Comprensión de los conceptos implementados

**Opcional (puntos extra):**
- Deploy en cloud con URL pública
- Waitlist funcional
- Notificaciones en tiempo real
- Tests de carga con JMeter y reporte de resultados
- Observabilidad (métricas, dashboards)
- Kubernetes deployment

**Conceptos de cierre:**

Reflexión grupal después de todas las presentaciones:
- **Monolito vs Microservicios:** cuándo usar cada arquitectura
- **Colas y procesamiento asíncrono:** beneficios y trade-offs
- **Concurrencia:** estrategias para manejarla correctamente
- **Estado eventual:** cómo comunicarlo al usuario
- **Idempotencia:** por qué es crítica en sistemas distribuidos
- **Testing:** importancia de tests en sistemas complejos

**Entregable final:**

- Proyecto completo funcionando
- Código fuente en repositorio (con README claro)
- Presentación (slides si aplica)
- (Opcional) Video demo del sistema
- (Opcional) Documentación técnica

**¡Mucho éxito en la presentación final!**
