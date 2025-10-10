# 📆 (Clase 3) Martes 7 de Octubre – Manejo de Estados Asíncronos en Inscripción

---

# Revisión del día

- Flujo `SeatRequested → SeatConfirmed/Rejected` implementado.
- Worker procesando solicitudes en orden.
- Validación de cupos en concurrencia.

---

## 📚 Conceptos clave (con más detalle)

### 🔹 1. Estado asincrónico en sistemas distribuidos

En un sistema real, cuando un estudiante intenta inscribirse, el backend **no responde de inmediato** con un resultado definitivo, porque el proceso puede depender de varios factores:

- ¿Quedan cupos disponibles?
- ¿La cola de procesamiento está saturada?
- ¿Existen conflictos de horario con otras materias inscritas?
- ¿Se recibió la solicitud más de una vez?

Por estas razones, es importante representar el flujo con **estados intermedios**:

- **PENDING:** la solicitud fue recibida, pero aún no se ha procesado.
- **CONFIRMED:** el estudiante fue inscrito exitosamente.
- **REJECTED:** no se pudo inscribir (ejemplo: no hay cupo o conflicto de horario).

Este enfoque es esencial para manejar sistemas distribuidos y de alta concurrencia.

---

### 🔹 2. Inscripción síncrona vs asíncrona

- **Síncrona (modelo tradicional en monolito):**
    - El usuario hace la request y el sistema responde inmediatamente con éxito o fallo.
    - Simple, pero no escala cuando hay cientos o miles de solicitudes simultáneas.
    - Ejemplo de la vida real: comprar una bebida en una máquina expendedora → metes la moneda y en el mismo instante recibes el producto.
- **Asíncrona (modelo distribuido con colas y workers):**
    - El usuario envía una request y recibe una respuesta de tipo “PENDING”.
    - El worker procesa la solicitud más tarde.
    - Finalmente, el sistema cambia el estado a CONFIRMED o REJECTED.
    - Ejemplo de la vida real: pedir una pizza → recibes un ticket de pedido, esperas, y más tarde te dicen si tu pizza está lista o si hubo un problema.

Este modelo es más robusto en entornos de alta concurrencia.

---

### 🔹 3. Estrategias para que el cliente se entere del resultado

Existen varias formas de informar al usuario el resultado final de su inscripción:

1. **Polling (consulta periódica):**
    - El cliente envía solicitudes cada cierto intervalo de tiempo para consultar el estado.
    - Ventajas: fácil de implementar.
    - Desventajas: genera tráfico extra en la red y carga en el servidor.
    - Uso típico: proyectos académicos, prototipos, sistemas simples.
2. **WebSockets:**
    - Se abre un canal persistente entre cliente y servidor.
    - El servidor puede enviar actualizaciones en tiempo real al cliente.
    - Ventajas: más eficiente, actualizaciones inmediatas.
    - Desventajas: mayor complejidad en implementación y mantenimiento.
3. **Server-Sent Events (SSE):**
    - Permite que el servidor envíe actualizaciones al cliente en una sola dirección.
    - Ideal para notificaciones y cambios de estado que no requieren interacción compleja.

👉 Para nuestro curso, **Polling** será suficiente como punto de partida. Los grupos más avanzados pueden intentar implementar WebSockets o SSE como opcional.

---

### 🔹 4. Ejemplo conceptual con analogías

- **Síncrono:**
    - Máquina expendedora: insertas la moneda y recibes el producto al instante.
    - Todo el proceso ocurre en un solo paso.
- **Asíncrono:**
    - Pedir una pizza: recibes un comprobante de pedido (estado PENDING).
    - El cocinero procesa la pizza (worker).
    - Más tarde, el sistema te avisa que tu pizza está lista (CONFIRMED) o que no hay ingredientes (REJECTED).

Estas analogías ayudan a los estudiantes a visualizar el comportamiento asincrónico.

---

## 📖 Referencias y citas recomendadas

- Newman, Sam. *Building Microservices: Designing Fine-Grained Systems*. O’Reilly Media, 2021.
- Burns, Brendan, et al. *Designing Distributed Systems: Patterns and Paradigms for Scalable, Reliable Services*. O’Reilly Media, 2018.
- Fowler, Martin. ["Patterns of Asynchronous Interaction"](https://martinfowler.com/articles/async.html).
- Tanenbaum, Andrew S., y Maarten Van Steen. *Distributed Systems: Principles and Paradigms*. Pearson, 2017.

Estas fuentes refuerzan la importancia del diseño de sistemas distribuidos y asincrónicos.

---

## 💻 Ejemplo de código

Eemplo en **Python con Flask** para simular un flujo asincrónico básico:

```python
from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# simulamos una "base de datos" en memoria
enrollments = {}

@app.route("/enroll", methods=["POST"])
def enroll():
    req_id = str(len(enrollments) + 1)
    enrollments[req_id] = "PENDING"
    return jsonify({"request_id": req_id, "status": "PENDING"})

@app.route("/status/<req_id>", methods=["GET"])
def status(req_id):
    status = enrollments.get(req_id, "NOT_FOUND")
    return jsonify({"request_id": req_id, "status": status})

@app.route("/process/<req_id>", methods=["POST"])
def process(req_id):
    if req_id in enrollments:
        # simulamos cupo: 50% confirmado, 50% rechazado
        enrollments[req_id] = random.choice(["CONFIRMED", "REJECTED"])
        return jsonify({"request_id": req_id, "status": enrollments[req_id]})
    return jsonify({"error": "not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)

```

👉 Flujo de uso:

1. `POST /enroll` → devuelve un `request_id` con estado PENDING.
2. `GET /status/{id}` → devuelve el estado actual de la inscripción.
3. `POST /process/{id}` → simula al worker que cambia PENDING → CONFIRMED o REJECTED.

Se puede correr este ejemplo en clase para demostrar cómo cambia el estado en tiempo real.

---

## 🛠️ Mini actividad (para los estudiantes)

**Objetivo:** implementar un endpoint que gestione estados asincrónicos.

**Actividad:**

1. Agregar un endpoint `/enrollment/status/{id}` en su API.
2. Probar en Postman que devuelva correctamente: *Pending/Confirmed/Rejected*.
3. Mockear un frontend simple (un botón que inscriba y un texto que muestre el estado actual).

**Entregable a revisar el Jueves 9 Oct:**

- Cliente Web conectado al backend mostrando estados de inscripción.
