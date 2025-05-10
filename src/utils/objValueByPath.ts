export function objValueByPath(path: string, obj: any) {
  if (path.trim() !== '' && typeof obj == 'object')
    return path.split('.').reduce((acc, k) => acc?.[k], obj);
  return obj;
}
