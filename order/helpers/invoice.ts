export function getInvoice(number: string): string {
  return `ETG-${number.padStart(8, '0')}`;
}
