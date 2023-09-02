export function generateUnique(prefix = '', suffix = ''): string {
  const timestamp = ((Date.now() / 1000) | 0).toString(16);
  const randomPart = ((Math.random() * 0x1000000) | 0).toString(32);
  return [prefix, timestamp + randomPart, suffix].filter(Boolean).join('-');
}
