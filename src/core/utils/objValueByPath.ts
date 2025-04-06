export function objValueByPath(path: string, obj: any) {
  return path.split('.').reduce((acc, k) => acc?.[k], obj);
}
