# 📆 (Clase 6) Jueves 16 de Octubre – Revisión de Proyecto y Presentación Refinada

---

# Revisión del día

- **Objetivo principal:** Revisar el avance del proyecto de cada equipo.
- **🔴 MUY IMPORTANTE:** Verificar que el proyecto esté dividido en **microservicios**.
- **🔴 MUY IMPORTANTE:** Verificar que estén usando **colas** para manejar la concurrencia.
- Validación de choques de horario y cupos implementada en Web/Mobile.
- Mensajes de error claros y descriptivos en la interfaz de usuario.
- Trazabilidad con `requestId` en los logs del sistema.

---

## 🎯 Enfoque de la clase

Esta clase es principalmente de **revisión y retroalimentación**. No habrá contenido teórico extenso, sino que nos enfocaremos en:

1. **Revisión del estado actual de cada proyecto.**
2. **Identificar áreas de mejora** antes de avanzar a las pruebas de carga.
3. **Responder preguntas** y resolver dudas específicas de implementación.
4. **Preparar el terreno** para la siguiente fase: pruebas de rendimiento con JMeter.

---

## 📋 Checklist de revisión

Durante la clase, revisaremos que cada equipo tenga implementado lo siguiente:

### Backend

- [ ] **Flujo asíncrono completo:**
  - Eventos `SeatRequested → SeatConfirmed/Rejected` funcionando.
  - Worker procesando solicitudes desde la cola.

- [ ] **Validaciones de negocio:**
  - Validación de cupos disponibles.
  - Validación de choques de horario (entre materias solicitadas y con materias ya inscritas).
  - Validación de prerequisitos (opcional pero recomendado).

- [ ] **Idempotencia:**
  - Uso de `requestId` para evitar duplicados.
  - Verificación de requests ya procesadas.

- [ ] **Manejo de errores:**
  - Códigos HTTP apropiados (409 para conflictos, 422 para validaciones, 500 para errores internos).
  - Mensajes de error descriptivos y estructurados en formato JSON.

- [ ] **Logs con trazabilidad:**
  - Todos los logs incluyen `requestId`.
  - Logs claros que permitan debuggear problemas.

### Frontend Web

- [ ] **Estados de inscripción:**
  - La UI muestra claramente: `PENDING`, `CONFIRMED`, `REJECTED`.

- [ ] **Manejo de estados asincrónicos:**
  - Indicadores de carga (spinners, mensajes de "procesando...").
  - Comunicación clara del estado PENDING al usuario.

- [ ] **Mensajes de error claros:**
  - Cupo lleno: mostrar mensaje específico.
  - Choque de horario: indicar con qué materia choca.
  - Errores técnicos: mensaje genérico amigable.

- [ ] **Experiencia de usuario:**
  - Feedback visual apropiado para cada acción.
  - Diseño limpio y usable.

### Frontend Mobile

- [ ] **Flujo completo MVP:**
  - Login (simulado o real).
  - Ver lista de materias disponibles.
  - Inscribirse en materias.
  - Ver estado de inscripciones.

- [ ] **Manejo de concurrencia:**
  - Evitar múltiples toques accidentales.
  - Manejo de red inestable (retry strategy opcional).

- [ ] **Consistencia con Web:**
  - Los mismos estados y validaciones que en Web.
  - Mensajes de error consistentes.

### Integración y funcionamiento

- [ ] **Flujo end-to-end:**
  - Desde el cliente (Web o Mobile) hasta la confirmación/rechazo final.

- [ ] **Simulación de concurrencia:**
  - Probar con múltiples usuarios simultáneos (manual o con scripts).
  - Verificar que los cupos no se excedan (ejemplo: 20 requests → 10 cupos → solo 10 confirmadas).

- [ ] **Casos de prueba:**
  - Inscripción exitosa.
  - Inscripción con cupo lleno.
  - Inscripción con choque de horario.
  - Inscripción duplicada (idempotencia).

---

## 🗣️ Preguntas guía para la revisión

Durante la clase, cada equipo responderá brevemente:

1. **¿Qué funciona actualmente en el proyecto?**
   - Describe el flujo que ya está implementado.

2. **¿Qué desafíos enfrentaste en el proyecto?**
   - Problemas técnicos, decisiones de diseño, bugs difíciles.

3. **¿Cómo el cliente se entera del cambio de estado?**
   - Solución técnica que se está utilizando

4. **¿Qué falta por implementar o mejorar?**
   - Ser honesto sobre lo que aún no está listo.

5. **¿Hay algún blocker que necesitas resolver?**
   - Dudas técnicas, dependencias externas, etc.

6. **¿Cómo planeas abordar las pruebas de carga con JMeter?**
   - ¿Ya pensaste en el escenario de prueba?

---

## 🔍 Conceptos clave a recordar (resumen rápido)

Aunque esta clase es de revisión, es importante tener presentes estos conceptos fundamentales que hemos visto hasta ahora:

### 1. Concurrencia y cupos limitados

- **Race conditions:** cuando múltiples usuarios compiten por el mismo recurso (cupos).
- **Solución:** procesamiento secuencial mediante colas (Producer-Consumer pattern).

### 2. Flujo asíncrono

- **Estados:** `PENDING → CONFIRMED/REJECTED`.
- **Estado eventual:** garantía de que el sistema eventualmente llegará a un estado final.

### 3. Idempotencia

- **requestId:** identificador único que permite detectar y evitar duplicados.
- **Beneficios:** evita inscripciones duplicadas, facilita el debugging.

### 4. Validaciones de negocio

- **Cupos disponibles:** verificar antes de confirmar.
- **Choques de horario:** validar tanto entre materias solicitadas como con materias ya inscritas.
- **Prerequisitos:** verificar que el estudiante cumpla con los requisitos previos.

### 5. Manejo de errores

- **Códigos HTTP apropiados:** 409 Conflict, 422 Unprocessable Entity, 500 Internal Server Error.
- **Mensajes claros:** descriptivos, accionables, contextualizados y amigables.

### 6. Tolerancia a fallos

- **Atomicidad:** en inscripciones múltiples, garantizar que todas se procesen de manera consistente.
- **Circuit breakers y retries:** estrategias avanzadas para manejar fallos (opcional).

---

## 📊 Vista previa: JMeter y pruebas de carga

En la siguiente clase comenzaremos con **pruebas de rendimiento** usando JMeter. Para prepararte, ten en cuenta:

### ¿Qué es JMeter?

**Apache JMeter** es una herramienta open-source para realizar pruebas de carga y medir el rendimiento de aplicaciones.

### ¿Por qué es importante?

- **Simula usuarios concurrentes:** puedes probar cómo se comporta tu sistema con 50, 100, 500 usuarios simultáneos.
- **Identifica cuellos de botella:** descubres qué partes del sistema son más lentas.
- **Valida la arquitectura:** confirma que tu diseño de colas y workers realmente maneja la concurrencia correctamente.

### Métricas clave que mediremos

1. **Latencia promedio:** tiempo que tarda una request en completarse.
2. **Throughput:** número de requests procesadas por segundo.
3. **Tasa de éxito:** porcentaje de requests exitosas vs fallidas.
4. **Percentiles (p95, p99):** latencia para el 95% y 99% de los usuarios (opcional pero recomendado).

### Escenario de prueba típico

```
Configuración JMeter:
- 50-100 usuarios concurrentes
- Cada usuario intenta inscribirse en una materia con cupos limitados
- Ejemplo: 100 usuarios → 20 cupos disponibles
- Resultado esperado: 20 confirmadas, 80 rechazadas
- Verificar que no se excedan los cupos
```

### Mínimo obligatorio para el Martes 21 Oct

- Crear plan JMeter básico con 50-100 usuarios concurrentes.
- Reportar:
  - Latencia promedio.
  - Tasa de éxito.
  - Confirmar que no se rompen los cupos.

---

## 💡 Consejos antes de la siguiente fase

### 1. Estabiliza lo que tienes

Antes de avanzar a pruebas de carga, asegúrate de que tu sistema funciona correctamente con pocos usuarios. Si algo falla con 2-3 usuarios, fallará mucho más con 100.

### 2. Implementa logs robustos

Los logs serán tu mejor amigo durante las pruebas de carga. Asegúrate de que:
- Todos los eventos importantes estén logueados.
- Cada log incluya `requestId` para trazabilidad.
- Los logs no sean demasiado verbosos (evita loguear en loops con miles de iteraciones).

### 3. Prueba manualmente primero

Antes de usar JMeter, prueba manualmente los casos extremos:
- ¿Qué pasa si 5 personas intentan tomar el último cupo?
- ¿Qué pasa si alguien envía la misma request 3 veces seguidas?
- ¿Qué pasa si el worker se cae mientras procesa solicitudes?

### 4. Documenta tus decisiones

A medida que implementas, documenta:
- ¿Por qué elegiste esa estructura de cola?
- ¿Por qué decidiste validar los horarios de esa manera?
- ¿Qué trade-offs consideraste?

Esto te ayudará en la presentación final.

### 5. No reinventes la rueda

Si algo es complicado, busca referencias:
- Ejemplos de validación de horarios.
- Patrones de idempotencia.
- Configuraciones de JMeter.

Está bien inspirarse en código existente (con atribución apropiada).

---

## 🎯 Tarea para la siguiente clase (Martes 21 Oct)

### Mínimo obligatorio

1. **Crear un plan de prueba JMeter:**
   - Configurar 50-100 usuarios concurrentes.
   - Simular inscripciones en una materia con cupos limitados (ejemplo: 20 cupos).

2. **Ejecutar la prueba y recopilar métricas:**
   - Latencia promedio.
   - Tasa de éxito (confirmadas vs rechazadas).
   - Verificar que no se excedan los cupos.

3. **Preparar un reporte básico:**
   - Capturas de pantalla de JMeter.
   - Resultados numéricos (latencia, throughput, tasa de éxito).
   - Observaciones: ¿el sistema se comportó como esperabas?

### Opcional (recomendado)

- Reportar percentiles (p95, p99).
- Graficar latencia vs número de usuarios.
- Probar con diferentes escenarios (50, 100, 200 usuarios).
- Identificar cuellos de botella en tu sistema.

---

## 📚 Recursos útiles

### Documentación de JMeter

- [Apache JMeter - Getting Started](https://jmeter.apache.org/usermanual/get-started.html)
- [JMeter Tutorial - Building a Web Test Plan](https://jmeter.apache.org/usermanual/build-web-test-plan.html)

### Tutoriales y guías

- [JMeter Load Testing Tutorial](https://www.blazemeter.com/blog/jmeter-tutorial)
- [How to Analyze JMeter Results](https://www.blazemeter.com/blog/how-to-analyze-jmeter-results)

### Herramientas complementarias

- [JMeter Plugins](https://jmeter-plugins.org/) - extensiones útiles para gráficos y reportes avanzados.

---

## 🤔 Preguntas frecuentes

### ¿Qué pasa si mi sistema no está listo para pruebas de carga?

No hay problema. Primero estabiliza tu implementación. Es mejor tener un sistema funcionando bien con pocos usuarios que uno que falla con 100.

### ¿Tengo que usar JMeter o puedo usar otra herramienta?

Recomendamos JMeter porque es la herramienta estándar en la industria y tiene una comunidad enorme. Pero si ya conoces otra herramienta (Gatling, Locust, K6), puedes usarla.

### ¿Cómo sé si mi sistema pasó la prueba?

Un sistema exitoso debe:
1. No exceder los cupos disponibles (ejemplo: 20 cupos → máximo 20 confirmadas).
2. Responder en un tiempo razonable (latencia < 2-3 segundos es aceptable para este proyecto).
3. No mostrar errores 500 (errores internos del servidor).

### ¿Qué hago si descubro que mi sistema es lento?

Identifica el cuello de botella:
- ¿Es el worker que procesa muy lento?
- ¿Es la base de datos que no da abasto?
- ¿Es el sistema de colas?

Luego optimiza esa parte específica. En la siguiente clase hablaremos más de esto.

---

## 🎓 Reflexión final

Esta clase es un **checkpoint** importante en el proyecto. Es el momento de:

1. **Evaluar dónde estás** con respecto a los objetivos del proyecto.
2. **Identificar qué falta** y priorizar esas tareas.
3. **Prepararte para la fase de pruebas** que viene en las próximas clases.

**Recuerda:** el objetivo no es tener un sistema perfecto, sino un sistema que **funcione correctamente** y que demuestre tu comprensión de los conceptos de concurrencia, estado eventual, y manejo de errores.

---

## 📅 Próxima clase: Martes 21 de Octubre

**Tema:** Introducción a JMeter y pruebas de carga básicas.

**Entregable a revisar:**
- Script JMeter configurado.
- Reporte básico con métricas de latencia y tasa de éxito.
- Validación de que los cupos no se exceden bajo carga.

---

¡Nos vemos en la próxima clase!
