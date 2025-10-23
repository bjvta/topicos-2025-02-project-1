# Clase 8 - Testing Práctico

Ejemplos de código para la clase de testing con 3 ejercicios progresivos.

## 📦 Instalación

```bash
npm install
```

## 🧪 Ejecutar tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests con interfaz visual
```bash
npm run test:ui
```

### Ejecutar tests por ejercicio

```bash
# Ejercicio 1 - Demo del profesor
npm run test:ejercicio1

# Ejercicio 2 - Práctica guiada
npm run test:ejercicio2

# Ejercicio 3 - Práctica independiente
npm run test:ejercicio3
```

## 📁 Estructura

```
clase-8/
├── ejercicio-1-demo/              # Demo del profesor (15 min)
│   ├── calcularPrecioFinal.js     # ✅ Implementación completa
│   └── calcularPrecioFinal.test.js
│
├── ejercicio-2-guiado/            # Práctica guiada (20 min)
│   └── README.md                  # 📝 Guía para hacer en vivo
│
├── ejercicio-3-independiente/     # Práctica independiente (25 min)
│   └── README.md                  # 📝 Instrucciones para estudiantes
│
├── package.json
└── README.md
```

**Nota importante:**
- **Ejercicio 1:** Código completo listo para demostrar
- **Ejercicio 2:** Sin código - para hacer en vivo con los estudiantes
- **Ejercicio 3:** Sin código - para que los estudiantes lo hagan solos

## 📝 Descripción de ejercicios

### Ejercicio 1: `calcularPrecioFinal(precio, descuento)`

**Objetivo:** El profesor demuestra cómo escribir tests paso a paso.

**Función:**
- Recibe un precio y un porcentaje de descuento (0-100)
- Retorna el precio final después de aplicar el descuento
- Validaciones: descuento inválido retorna precio original, precio negativo retorna 0

**Casos cubiertos:**
- ✅ Casos normales (10%, 50%, 25% de descuento)
- ✅ Edge cases (0%, 100% de descuento)
- ✅ Validación (descuento negativo, mayor a 100, precio negativo)

---

### Ejercicio 2: `validarCuposDisponibles(capacidad, inscritos, solicitados)`

**Objetivo:** Práctica guiada - escribir tests junto con el profesor.

📂 **Ver guía completa en:** `ejercicio-2-guiado/README.md`

**Qué harás:**
- Identificar casos de prueba con los estudiantes
- Escribir tests en vivo paso a paso
- Implementar la función juntos
- La solución completa está en el README del ejercicio (spoiler colapsado)

---

### Ejercicio 3: `calcularNotaFinal(parcial1, parcial2, final)`

**Objetivo:** Los estudiantes escriben tests y la implementación de forma independiente.

📂 **Ver instrucciones completas en:** `ejercicio-3-independiente/README.md`

**Los estudiantes deben:**
- Planificar qué casos probar
- Escribir todos los tests
- Implementar la función
- Ejecutar y verificar
- La solución de referencia está en el README del ejercicio (para ti)

---

## 💡 Consejos para dar la clase

1. **Ejercicio 1 (Demo):**
   - Muestra el proceso completo - no solo el resultado final
   - Ejecuta los tests después de cada cambio
   - Explica por qué cada test es importante

2. **Ejercicio 2 (Guiado):**
   - Lee la guía en `ejercicio-2-guiado/README.md` antes de clase
   - Deja que los estudiantes propongan casos antes de escribir código
   - Escribe en vivo - no copies y pegues

3. **Ejercicio 3 (Independiente):**
   - Comparte el `ejercicio-3-independiente/README.md` con los estudiantes
   - Circula preguntando mientras trabajan (las preguntas están en el README)
   - Pide a 2-3 estudiantes que presenten sus soluciones al final

---

## 🔗 Recursos adicionales

- [Documentación de Vitest](https://vitest.dev/)
- [Matchers de expect](https://vitest.dev/api/expect.html)
- Referencia de clase: `lectures/clase-07-testing-integracion.md`
