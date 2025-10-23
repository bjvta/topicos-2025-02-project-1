// calcularPrecioFinal.js
// Función que calcula el precio final después de aplicar un descuento

export function calcularPrecioFinal(precio, descuento) {
  // Validar precio
  if (precio < 0) {
    return 0;
  }

  // Validar descuento
  if (descuento < 0 || descuento > 100) {
    return precio;
  }

  // Calcular precio con descuento
  const montoDescuento = (precio * descuento) / 100;
  return precio - montoDescuento;
}
