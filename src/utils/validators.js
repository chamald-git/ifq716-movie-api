export function isValidYear(value) {
  return /^\d{4}$/.test(String(value));
}

export function isPositiveInt(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}