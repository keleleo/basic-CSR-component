export function watchaArray(initialValue: any[], onChange: () => void) {
  [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse',
    'fill',
    'copyWithin',
  ].forEach((key) => {
    const temp = (initialValue as any)[key];
    (initialValue as any)[key] = function (...items: any[]) {
      const res = temp.apply(this, items);
      onChange();
      return res;
    };
  });
}
