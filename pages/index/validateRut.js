export function validateRUT(rut) {
  // Verifica que el RUT esté en el formato correcto (solo puede contener un guion y no puntos)
  if (!/^[0-9]+-[0-9Kk]$/.test(rut)) {
      return false;
  }
  
  // Elimina el guion
  const cleanRUT = rut.replace("-", "");
  
  const rutBody = cleanRUT.slice(0, -1);
  let checkDigit = cleanRUT.slice(-1).toUpperCase();
  
  // Verifica si el cuerpo del RUT contiene solo números
  if (!/^[0-9]+$/.test(rutBody)) {
      return false;
  }
  
  let sum = 0;
  let multiplier = 2;
  
  // Calcula la suma ponderada del cuerpo del RUT
  for (let i = rutBody.length - 1; i >= 0; i--) {
      sum += multiplier * parseInt(rutBody.charAt(i));
      multiplier = (multiplier < 7) ? multiplier + 1 : 2;
  }
  
  // Calcula el dígito verificador
  const mod11 = 11 - (sum % 11);
  let calculatedCheckDigit = (mod11 === 11) ? "0" : (mod11 === 10) ? "K" : mod11.toString();
  
  return checkDigit === calculatedCheckDigit;
}