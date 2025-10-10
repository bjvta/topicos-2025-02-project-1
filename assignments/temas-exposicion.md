# Temas de Exposición - Sistema de Inscripciones

## Contexto
Para la clase del **Jueves 16**, los estudiantes que no presenten la mini presentación Web/Mobile van a exponer uno de los siguientes temas relacionados con los conceptos vistos en clase.

---

## 1. Consistencia Eventual y Estados Pendientes (Pending States)

**Objetivo:** Comprender cómo manejar operaciones asíncronas y comunicar estados intermedios al usuario.

**Contenido a cubrir:**
- Qué es la consistencia eventual en sistemas distribuidos
- Cómo comunicar estados intermedios al usuario (loading, pending, success, error)
- Patrones de UI para operaciones asíncronas
- Ejemplos prácticos en el flujo de inscripción

---

## 2. Manejo de Errores y Validaciones en Sistemas Web/Mobile

**Objetivo:** Entender estrategias de validación y cómo comunicar errores de forma clara al usuario.

**Contenido a cubrir:**
- Estrategias de validación: cliente vs servidor
- Tipos de errores de negocio (cupo lleno, choque de horario)
- Mensajes de error claros y UX
- Rollback y recuperación de errores

---

## 3. Trazabilidad con Request ID y Logging

**Objetivo:** Aprender sobre observabilidad y cómo rastrear operaciones en sistemas distribuidos.

**Contenido a cubrir:**
- Qué es un requestId y por qué es importante
- Cómo implementar logging distribuido
- Correlación de logs entre frontend, backend y BD
- Herramientas de observabilidad (concepto básico)

---

## 4. Validaciones de Negocio en Backend (Choque de Horarios)

**Objetivo:** Entender qué validaciones son críticas en el servidor y cómo prevenir inconsistencias.

**Contenido a cubrir:**
- Validaciones críticas que NUNCA deben ir solo en frontend
- Implementación de validación de choques de horario
- Race conditions y cómo prevenirlas
- Transacciones y bloqueos en BD

---

## 5. Sincronización de Estado entre Web y Mobile

**Objetivo:** Comprender cómo mantener consistencia entre diferentes clientes del mismo sistema.

**Contenido a cubrir:**
- Arquitecturas API-first
- Contratos de API (request/response)
- Manejo de estados compartidos
- Diferencias de UX entre web y mobile para el mismo flujo

---

**Formato:**
- 10-15 minutos
- Explicación del concepto teórico
- Aplicación específica en el proyecto de inscripciones
- Ejemplo de código o diagrama
- 2-3 preguntas para la clase

---
