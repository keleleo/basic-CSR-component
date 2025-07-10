export class ObjectPath {
  #path: string;
  #deep: number;

  get value() {
    return this.#path;
  }

  get deep() {
    return this.#deep;
  }

  get root() {
    return this.#path.split('.')[0];
  }

  get pathWithOutRoot() {
    const i = this.#path.indexOf('.');
    return i === -1 ? '' : this.#path.slice(i + 1);
  }

  constructor(path: string) {
    this.#path = path.trim();
    this.#deep = path.split('.').length;
  }

  public extractValue(obj: any) {
    if (this.value !== '' && typeof obj === 'object')
      return this.value.split('.').reduce((acc, k) => acc?.[k], obj);
    return obj;
  }

  public changeValue(obj: any, value: any) {
    const path = this.pathWithOutRoot;
    if (typeof obj !== 'object' || obj === null || !path.trim()) return value;
    const keys = path.split('.');
    const lastkey = keys.pop() || '';
    const objParent = keys.reduce((acc, key) => acc?.[key], obj);

    objParent[lastkey] = value;
    return obj;
  }
}
