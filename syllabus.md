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

**Mínimo obligatorio para la siguiente clase (Martes 21 Oct):**

- Crear plan JMeter con 50–100 usuarios concurrentes.
- Reportar latencia promedio y tasa de éxito.

**Opcional:**

- Reportar p95/p99 y throughput.

**Entregable a revisar el 21 Oct:**

- Script JMeter + reporte básico.

---

## 📆 Martes 21 de Octubre — JMeter básico

**Revisión del día:**

- Presentar resultados JMeter (50–100 usuarios).

**Conceptos a ver en clase:**

- Diferencia entre pruebas de carga y de estrés.
- Métricas: latencia, throughput, error rate.
- Percentiles p95/p99.

**Mínimo obligatorio para la siguiente clase (Jueves 23 Oct):**

- Subir al cloud un servicio + cliente Web.

**Opcional:**

- Subir todo el ecosistema.
- Pipeline de deploy.

**Entregable a revisar el 23 Oct:**

- Proyecto accesible en la nube.

---

## 📆 Jueves 23 de Octubre — Deploy en Cloud + Kubernetes

**Revisión del día:**

- Verificar URL del servicio en cloud.

**Conceptos a ver en clase:**

- Diferencias local vs cloud.
- PaaS vs IaaS.
- Escalado horizontal de microservicios.
- **Introducción a Kubernetes:**
    - Pod, Deployment y Service.
    - Cómo simula un entorno de producción.
    - Diferencia entre Docker Compose y Kubernetes.

**Mínimo obligatorio para la siguiente clase (Martes 28 Oct):**

- Preparar arquitectura (diagrama simple).
- Demo 20→10 cupos en cloud.
- Reporte JMeter integrado.

**Opcional:**

- Subir un microservicio en Kubernetes (minikube/kind).
- Configurar un Ingress simple para exponerlo.
- Métricas visibles.

**Entregable a revisar el 28 Oct:**

- Presentación intermedia con demo en cloud.

---

## 📆 Martes 28 de Octubre — Presentación intermedia

**Revisión del día:**

- Exponer arquitectura y demo en cloud.
- Mostrar resultados JMeter.

**Conceptos a ver en clase:**

- Diagnóstico de cuellos de botella.
- Priorización de mejoras.
- Checklist de final.

**Mínimo obligatorio para la siguiente clase (Jueves 30 Oct):**

- Corregir observaciones.
- Estabilidad en cloud.
- Pulir UX en Web/Mobile.
- Preparar demo final.

**Opcional:**

- Waitlist real.
- Notificaciones.
- Métricas visuales.

**Entregable a revisar el 30 Oct:**

- Demo final lista.

---

## 📆 Jueves 30 de Octubre — Presentación final

**Revisión del día:**

- Demos finales de cada equipo.

**Conceptos a ver en clase:**

- Cierre: monolito vs microservicios, colas, idempotencia, backpressure.
- Reflexión final: ¿cuándo usar colas?

**Mínimo obligatorio:**

- Web + Mobile completos.
- Flujo concurrente con cupos.
- Deploy en cloud.
- Resultados JMeter.

**Opcional:**

- Waitlist.
- Notificaciones.
- Observabilidad avanzada.

**Entregable final:**

- Proyecto completo y evaluación final.