export function validateRut(rut) {
  const cleanRUT = rut.replace(/[.\-]/g, "");
  const body = cleanRUT.slice(0, -1);
  let vDigit = cleanRUT.slice(-1).toUpperCase();
  if(!/^[0-9]+$/.test(body)){
      return false;
  }
  let sum = 0;
  let mult = 2;
  for(let i = body.length - 1; i >= 0; i--){
      sum += mult * parseInt(body.charAt(i));
      mult = mult < 7 ? mult + 1 : 2;
  }
  const mod11 = 11 - (sum % 11);
  let calcDigit = mod11 === 11 ? "0" : mod11 === 10 ? "K" : mod11.toString();
  return vDigit === calcDigit;
}