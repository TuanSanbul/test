export function getPattern(prefixCmd: string[], functionName: string): string {
  const cmd = [...prefixCmd, functionName];
  return cmd.join('.');
}
