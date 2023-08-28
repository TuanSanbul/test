export function parseWithSymbolMetadata(str: string, symbol: string): string[] {
  return str.split(symbol);
}

export function parseJwtHeader(authHeader: string) {
  let jwt: string = authHeader;
  const authHeaderParts = (authHeader as string).split(' ');
  if (authHeaderParts.length == 2) {
    const [, jwtParse] = authHeaderParts;
    jwt = jwtParse;
  }
  return jwt;
}
