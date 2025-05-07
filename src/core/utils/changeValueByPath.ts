export function changeValueByPath(obj: any, path: string, value: any) {
  if (typeof obj !== 'object' || obj === null || !path.trim()) return value;

  const keys = path.split('.');
  const lastkey = keys.pop() || '';
  const objParent = keys.reduce((acc, key) => acc?.[key], obj);

  objParent[lastkey] = value;
  return obj;
}
