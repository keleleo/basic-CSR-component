import { ObjectPath } from '../class/objectPath';

/**
 *
 * @deprecated
 */
export function objValueByPath(path: ObjectPath, obj: any) {
  const pwr = path.pathWithOutRoot;

  if (pwr !== '' && typeof obj === 'object')
    return pwr.split('.').reduce((acc, k) => acc?.[k], obj);
  return obj;
}
