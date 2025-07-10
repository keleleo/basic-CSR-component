import { ObjectPath } from '../class/objectPath';
/**
 *
 * @deprecated
 */
export function changeValueByPath(obj: any, path: ObjectPath, value: any) {
  if (typeof obj !== 'object' || obj === null) return value;

  const keys = path.pathWithOutRoot.split('.');
  const lastkey = keys.pop() || '';
  const objParent = keys.reduce((acc, key) => acc?.[key], obj);

  objParent[lastkey] = value;
  return obj;
}
