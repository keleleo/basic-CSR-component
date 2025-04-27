export function pathWithoutRootAtt(str: string) {
  const i = str.indexOf('.');
  return i == -1 ? '' : str.slice(i + 1);
}
