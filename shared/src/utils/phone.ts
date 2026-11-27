/** Normalises Nigerian numbers to international digits, e.g. 0803… → 234803…. */
export function toInternationalNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0') && digits.length === 11) return `234${digits.slice(1)}`;
  if (digits.length === 10) return `234${digits}`;
  return digits;
}

export function isValidNigerianNumber(value: string) {
  return /^234[789][01]\d{8}$/.test(toInternationalNumber(value));
}

export function whatsAppLink(phone: string, message: string) {
  const number = toInternationalNumber(phone);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function callLink(phone: string) {
  const number = toInternationalNumber(phone);
  return number ? `tel:+${number}` : null;
}

export function maskPhone(phone: string) {
  const number = toInternationalNumber(phone);
  if (number.length < 7) return '•••• •••• •••';
  return `+${number.slice(0, 3)} ${number.slice(3, 6)} ••• ••${number.slice(-2)}`;
}
