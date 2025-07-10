export function createProxy(original: any, replace: any) {
  return new Proxy(original, {
    get(target, prop) {
      if (prop in replace) return replace[prop];
      return target[prop];
    },
    has(target, prop) {
      return prop in replace || prop in target;
    },
  });
}
