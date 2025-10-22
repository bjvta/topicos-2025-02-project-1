# Jest Testing Cheat Sheet 🧪

## Comandos Rápidos

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Solo unit tests
npm run test:unit

# Solo integration tests
npm run test:integration

# Un archivo específico
npm test tests/unit/validators/seatsValidator.test.js

# Un test específico por nombre
npm test -- -t "should return valid when seats are available"

# Tests que coincidan con un patrón
npm test -- -t "concurrent"

# Archivo + test específico
npm test tests/integration/enrollmentFlow.test.js -t "concurrent"
```

### Modo Watch (Desarrollo)

```bash
# Watch todos los tests
npm run test:watch

# Watch un archivo específico
npm test -- --watch tests/unit/validators/seatsValidator.test.js

# Watch tests que coincidan con patrón
npm test -- --watch -t "concurrent"
```

### Coverage

```bash
# Generar reporte de cobertura
npm run test:coverage

# Abrir reporte HTML
open coverage/lcov-report/index.html   # macOS
xdg-open coverage/lcov-report/index.html   # Linux
start coverage/lcov-report/index.html  # Windows
```

### Debugging

```bash
# Ejecutar con más detalle (verbose)
npm test -- --verbose

# Detener en el primer error
npm test -- --bail

# Solo tests que fallaron
npm test -- --onlyFailures

# Debugger de Node.js
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Sintaxis de Tests

### Test básico

```javascript
test('descripción del test', () => {
  // Arrange
  const input = { capacity: 10, enrolledCount: 5 };

  // Act
  const result = validateSeats(input);

  // Assert
  expect(result.valid).toBe(true);
});
```

### Test asíncrono

```javascript
test('async test', async () => {
  const result = await myAsyncFunction();
  expect(result).toBe(expected);
});
```

### Agrupación con describe

```javascript
describe('validateSeats', () => {
  test('case 1', () => { /* ... */ });
  test('case 2', () => { /* ... */ });
});
```

### Setup y Teardown

```javascript
beforeEach(() => {
  // Se ejecuta ANTES de cada test
  db.clearAll();
});

afterEach(() => {
  // Se ejecuta DESPUÉS de cada test
});

beforeAll(() => {
  // Se ejecuta UNA VEZ antes de todos los tests
});

afterAll(() => {
  // Se ejecuta UNA VEZ después de todos los tests
});
```

## Assertions Comunes

```javascript
// Igualdad
expect(value).toBe(5);                    // Igualdad estricta (===)
expect(obj).toEqual({ a: 1 });            // Igualdad profunda

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Números
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(5);
expect(value).toBeLessThanOrEqual(5);
expect(value).toBeCloseTo(0.3);          // Para floats

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', value);

// Excepciones
expect(() => myFunction()).toThrow();
expect(() => myFunction()).toThrow(Error);
expect(() => myFunction()).toThrow('error message');

// Promises
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

## Ejecutar Solo Algunos Tests

### Método 1: Usar `.only`

```javascript
// Solo este test
test.only('este test', () => { /* ... */ });

// Solo este grupo
describe.only('este grupo', () => {
  test('test 1', () => { /* ... */ });
  test('test 2', () => { /* ... */ });
});
```

### Método 2: Usar `.skip`

```javascript
// Saltar este test
test.skip('saltar este', () => { /* ... */ });

// Saltar este grupo
describe.skip('saltar este grupo', () => {
  test('test 1', () => { /* ... */ });
});
```

### Método 3: Línea de comandos

```bash
# Por nombre
npm test -- -t "nombre del test"

# Por archivo
npm test tests/unit/validators/seatsValidator.test.js
```

## Tips de Productividad

### 1. Watch Mode para desarrollo rápido

```bash
npm test -- --watch tests/unit/validators/seatsValidator.test.js
```

Modifica el código → test se re-ejecuta automáticamente.

### 2. Ejecutar solo tests fallidos

```bash
npm test -- --onlyFailures
```

### 3. Ver solo el resumen

```bash
npm test -- --silent
```

### 4. Ejecutar tests en paralelo (más rápido)

```bash
npm test -- --maxWorkers=4
```

### 5. Actualizar snapshots

```bash
npm test -- -u
```

## Debugging Tips

### Console.log en tests

```javascript
test('debug test', () => {
  const result = validateSeats({ capacity: 10, enrolledCount: 5 });
  console.log('Result:', result);  // ← Ver en consola
  expect(result.valid).toBe(true);
});
```

### Debugger en VSCode

Crear `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Luego poner breakpoints y presionar F5.

### Debugger en Chrome

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Luego abrir `chrome://inspect` en Chrome.

## Errores Comunes

### Error: "Cannot find module"

```bash
# Verificar que instalaste las dependencias
npm install

# Verificar que la ruta es correcta
npm test tests/unit/validators/seatsValidator.test.js
```

### Error: "Test timeout"

```javascript
// Aumentar timeout para tests lentos
test('slow test', async () => {
  // ...
}, 10000); // 10 segundos
```

O en jest.config.js:

```javascript
export default {
  testTimeout: 10000
};
```

### Error: "Cannot use import outside a module"

Verificar que `package.json` tenga:

```json
{
  "type": "module"
}
```

## Common Patterns & Gotchas

### Race Condition en Idempotencia

❌ **Problema** (tiene race condition):
```javascript
async createItem(requestId) {
  const existing = await db.findByRequestId(requestId);  // Check
  if (existing) return existing;

  const item = await db.create({ requestId });  // Create
  return item;
}
```

**¿Por qué falla?** Entre el `check` y el `create`, otro proceso puede crear el mismo item.

✅ **Solución** (operación atómica):
```javascript
async createItem(requestId) {
  // Atomic check-and-set en una sola operación
  const { item, created } = await db.createIfNotExists({ requestId });
  if (!created) {
    console.log('Duplicate detected');
  }
  return item;
}
```

**Clave:** Combinar check + create en una operación atómica.

### Testing de Race Conditions

```javascript
test('should handle concurrent requests', async () => {
  // Crear múltiples requests con mismo requestId
  const promises = Array(5).fill(null).map(() =>
    service.createItem('same-request-id')
  );

  const results = await Promise.all(promises);

  // Todos deben devolver el MISMO item (mismo ID)
  const uniqueIds = new Set(results.map(r => r.id));
  expect(uniqueIds.size).toBe(1); // Solo 1 item creado
});
```

## Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest Expect API](https://jestjs.io/docs/expect)
- [Jest CLI Options](https://jestjs.io/docs/cli)

---

**Pro Tip:** Imprime esta hoja y tenla a mano durante desarrollo! 📄✨
