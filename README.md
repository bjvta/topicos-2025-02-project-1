# Tópicos - UAGRM 2025-02

Repositorio del curso de Tópicos, enfocado en el desarrollo de un **Sistema de Inscripción Universitaria** utilizando arquitecturas modernas, concurrencia y manejo de estado.

## Sobre el Curso

Este curso es un proyecto práctico donde se aprenderá a construir sistemas distribuidos modernos, enfrentando desafíos reales como:

- Manejo de concurrencia con cupos limitados
- Arquitecturas basadas en microservicios
- Desarrollo de clientes Web y Mobile
- Gestión de estados asincrónicos
- Testing de carga y deployment en la nube

## Estructura del Repositorio

```
topicos-2025-02-project-1/
├── README.md                  # Este archivo
├── syllabus.md                # Cronograma detallado del curso
├── lectures/                  # Material de clases
│   ├── clase-03-manejo-estado.md
│   ├── clase-04-concurrencia-mobile.md
│   └── ...
├── examples/                  # Ejemplos de código por clase
│   ├── clase-02-microservices/    # Arquitectura de microservicios
│   ├── clase-04-mobile-app/       # Aplicación móvil con React Native
│   └── ...
├── assignments/               # Tareas y temas de exposición
│   └── temas-exposicion.md
└── assets/                    # Recursos e imágenes
    └── images/
```

## Navegación Rápida

### Sistema de Evaluación

El proyecto se evalúa de la siguiente manera:
- **25%** - Presentación intermedia (16 de Octubre)
- **25%** - Presentación final (30 de Octubre)
- **50%** - Tareas semanales y actividades en clase

Consulta el [syllabus.md](./syllabus.md) para ver el desglose completo de la evaluación.

### Cronograma

Consulta el [syllabus.md](./syllabus.md) para ver el cronograma completo del curso con:
- Sistema de evaluación detallado
- Fechas de entrega
- Conceptos a cubrir en cada clase
- Entregables mínimos y opcionales

### Material de Clases

Accede a las notas de clase en la carpeta [lectures/](./lectures/):
- **Clase 3**: [Manejo de Estado](./lectures/clase-03-manejo-estado.md)
- **Clase 4**: [Concurrencia y Consistencia en Mobile](./lectures/clase-04-concurrencia-mobile.md)

### Ejemplos de Código

Explora los ejemplos funcionales en [examples/](./examples/):
- **Clase 2**: [Arquitectura de Microservicios con Docker](./examples/clase-02-microservices/) - Sistema completo con API Gateway y servicios independientes
- **Clase 4**: [Aplicación Mobile con React Native](./examples/clase-04-mobile-app/) - Cliente móvil para inscripción de materias

Cada ejemplo incluye su propio README con instrucciones de instalación y ejecución.

### Tareas y Exposiciones

Revisa los temas de exposición y tareas en [assignments/](./assignments/)

## Proyecto Principal: Sistema de Inscripción Universitaria

El proyecto consiste en desarrollar un sistema de inscripción que incluye:

### Backend
- Arquitectura de microservicios
- Manejo de concurrencia con colas (Producer-Consumer)
- Validación de cupos limitados
- Idempotencia con `requestId`
- API Gateway con nginx

### Frontend Web
- Interfaz para inscripción de materias
- Manejo de estados: Pending, Confirmed, Rejected
- Actualización en tiempo real (Polling/WebSockets/SSE)

### Frontend Mobile
- Aplicación nativa (React Native/Flutter/etc)
- Retry strategies
- Persistencia local de sesión

### Testing y Deployment
- Pruebas de carga con JMeter
- Deployment en la nube
- Introducción a Kubernetes

## Tecnologías Principales

- **Backend**: Node.js, Next.js, Docker
- **Frontend Web**: React, Next.js, etc
- **Mobile**: React Native (Expo), etc
- **Infraestructura**: Docker, Docker Compose, nginx
- **Testing**: JMeter
- **Cloud**: AWS, etc

## Fechas Importantes

- **14 de Octubre**: Mini Presentación Web/Mobile
- **21 de Octubre**: Resultados de pruebas con JMeter
- **28 de Octubre**: Presentación intermedia con demo en cloud
- **30 de Octubre**: Presentación final

## Recursos Adicionales

- [Designing Data-Intensive Applications](https://dataintensive.net/) - Martin Kleppmann
- [Patterns of Enterprise Application Architecture](https://martinfowler.com/books/eaa.html) - Martin Fowler
- [Mobile App UX Principles](https://developers.google.com/web/fundamentals/design-and-ux/principles)

---

**Universidad Autónoma Gabriel René Moreno (UAGRM)**
Carrera de Ingeniería Informática
Semestre 2025-02
