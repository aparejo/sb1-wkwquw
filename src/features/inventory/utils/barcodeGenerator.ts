// Función para generar un código de barras único
export function generateBarcode(prefix: string = '299'): string {
  // Generamos un número aleatorio de 9 dígitos
  const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  
  // Concatenamos el prefijo con el número aleatorio
  const code = prefix + random;
  
  // Calculamos el dígito verificador (algoritmo EAN-13)
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i]);
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  // Retornamos el código completo con el dígito verificador
  return code + checkDigit;
}

// Función para validar si un código de barras ya existe
export function validateBarcode(barcode: string): boolean {
  if (!/^\d{13}$/.test(barcode)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i]);
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return parseInt(barcode[12]) === checkDigit;
}

// Función para generar un código único para productos artesanales
export function generateCustomBarcode(productId: string): string {
  // Usamos un prefijo diferente para productos artesanales (ejemplo: 299)
  return generateBarcode('299');
}