export class Emitter<T extends (...args: any) => void> {
  #listeners: Set<T> | undefined;

  listen(fun: T) {
    this.getListeners().add(fun);
    return () => {
      this.removeListener(fun);
    };
  }

  removeListener(fun: T) {
    this.getListeners().delete(fun);
  }

  emit(...args: Parameters<T>) {
    this.getListeners().forEach((fn) => fn(...args));
  }

  private getListeners() {
    if (this.#listeners === undefined) this.#listeners = new Set<T>();
    return this.#listeners;
  }
}
