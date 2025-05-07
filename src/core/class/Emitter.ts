export class Emitter<T extends (...args: any) => void> {
  #listeners = new Set<T>();

  listen(fun: T) {
    this.#listeners.add(fun);
  }
  removeListener(fun: T) {
    this.#listeners.delete(fun);
  }
  emit(...args: Parameters<T>) {
    this.#listeners.forEach((fn) => fn(...args));
  }
}
