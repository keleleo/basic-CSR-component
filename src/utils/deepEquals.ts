export function deepEqual(a: any, b: any, seen = new WeakMap()) {
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  )
    return false;

  if (seen.has(a) && seen.get(a) === b) return true;
  seen.set(a, b);

  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  const aArray = Array.isArray(a);
  const bArray = Array.isArray(b);
  if (aArray && !bArray) return false;
  if (aArray && bArray) return arrayEquals(a, b, seen);

  const aMap = a instanceof Map;
  const bMap = b instanceof Map;
  if (aMap && !bMap) return false;
  if (aMap && bMap) return mapEquals(a, b, seen);

  const aDate = a instanceof Date;
  const bDate = b instanceof Date;
  if (aDate && !bDate) return false;
  if (aDate && bDate) return dateEquals(a, b);

  const lKeys = Object.keys(a);
  const rKeys = Object.keys(b);
  if (lKeys.length != rKeys.length) return false;
  for (const key of lKeys) {
    if (!rKeys.includes(key)) return false;
    if (!deepEqual(a[key], b[key], seen)) return false;
  }

  return true;
}

export function dateEquals(a: Date, b: Date) {
  return a.getTime() === b.getTime();
}

export function arrayEquals(
  a: Array<any>,
  b: Array<any>,
  seen = new WeakMap()
) {
  const aSize = a.length;
  const bSize = b.length;
  let index = aSize;
  if (aSize != bSize) return false;
  while (index-- > 0) if (!deepEqual(a[index], b[index], seen)) return false;
  return true;
}

export function mapEquals(
  a: Map<any, any>,
  b: Map<any, any>,
  seen = new WeakMap()
) {
  if (a.size != b.size) return false;
  const matched = new Set();

  for (const [aKey, aVal] of a) {
    let found = false;
    for (const [bKey, bVal] of b) {
      if (matched.has(bKey)) continue;

      if (deepEqual(aKey, bKey, seen) && deepEqual(aVal, bVal, seen)) {
        found = true;
        matched.add(bKey);
        break;
      }
    }
    if (!found) return false;
  }
  return true;
}
