export function maskIC(icNumber: string): string {
  if (!icNumber || icNumber.length < 6) return icNumber;
  return `${icNumber.substring(0, 6)}******`;
}
