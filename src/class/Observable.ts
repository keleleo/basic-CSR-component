import { ReadOnlyDeep } from '../@types/readOnlyDeep';

export type ObservableListener<T> = (
  value: T,
  oldValue: T,
  changeCode: string
) => void;
export type ObservableBindListener<T> = (value: T, changeCode: string) => void;
//TODO: Implement type validation
// new Observable<number>(42, [String, Number]);  String, Number is a custon validators
export class Observable<T> {
  #value: T;
  #listeners = new Set<ObservableListener<T>>();
  #bindListeners = new Set<ObservableBindListener<T>>();
  #changeCode = '';

  constructor(initialValue: T) {
    this.#value = initialValue;
    this.updateChangeCode();
  }

  get(): ReadOnlyDeep<T> {
    return this.#value;
  }

  set(newValue: T, changeCode?: string) {
    if (this.#changeCode == changeCode) return;
    if (changeCode) this.#changeCode = changeCode;
    else this.updateChangeCode();
    const old = this.#value;
    this.#value = newValue;
    this.notify(this.#value, old);
  }

  change(fn: (prev: T) => T) {
    const newValue = fn(this.#value);
    this.set(newValue);
  }

  listen(listener: ObservableListener<T>) {
    this.#listeners.add(listener);
  }

  removeListener(listener: ObservableListener<T>) {
    this.#listeners.delete(listener);
  }

  bindSet(value: T, changeCode: string) {
    if (this.#changeCode == changeCode) return;
    const old = this.#value;
    this.#value = value;
    this.#changeCode = changeCode;
    this.notify(this.#value, old);
  }

  bind(observable: Observable<T>) {
    this.#bindListeners.add(observable.bindSet.bind(observable));
  }

  unbind(observable: Observable<T>) {
    this.#bindListeners.delete(observable.bindSet.bind(observable));
  }

  /**
   * @description emit the current value
   */
  emit() {
    this.notify(this.#value, this.#value);
  }
  private updateChangeCode() {
    this.#changeCode = Math.random().toString().slice(4, 10);
  }

  private notify(value: T, old: T) {
    this.#listeners.forEach((listener) =>
      listener(value, old, this.#changeCode)
    );
    this.#bindListeners.forEach((listener) =>
      listener(value, this.#changeCode)
    );
  }
}
