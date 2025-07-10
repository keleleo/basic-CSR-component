import { ActionType } from '../../@types/observableArray/actionType';
import { ChangInfo } from '../../@types/observableArray/changeInfo';
import { ReadOnlyDeep } from '../../@types/readOnlyDeep';
import { randomCode } from '../../utils/randomCode';
import { Emitter } from '../Emitter';
import { ObservableBase, ObservableListener } from './ObservableBase';

type ListenerType = (...data: ChangInfo[]) => void;
type itemCode = string;
type Item<T> = {
  value: T;
  chanCode: string;
  listeners: Emitter<ObservableListener<T>>;
  code: itemCode;
  index: number;
  observableItem?: ObservableBase<T>;
};
export class ObservableArray<T = any> extends Emitter<ListenerType> {
  #codes: itemCode[] = [];
  #itemMap = new Map<itemCode, Item<T>>();

  //TODO: Imp initial value

  get value(): ObservableBase<T>[] {
    return this.#codes.map((code) => {
      const item = this.#itemMap.get(code) as Item<T>;
      return this.#itemToObservable(item);
    });
  }
  get items() {
    return this.#codes.map((code) => {
      return this.#itemMap.get(code) as Item<T>;
    });
  }
  get length() {
    return this.#codes.length;
  }

  set(i: number, value: T, changeCode?: string) {
    if (i >= this.#itemMap.size) return;
    const itemCode = this.#codes[i];
    if (itemCode === undefined) return;
    this.#setByCode(itemCode, value, changeCode);
  }

  #setByCode(itemCode: string, value: T, changeCode?: string) {
    const item = this.#itemMap.get(itemCode);
    if (item === undefined || item.chanCode === changeCode) return;

    item.value = value;
    item.chanCode = changeCode || randomCode();
    this.#onChange([item.index], ActionType.UPDATE);
  }

  push(...items: T[]) {
    const firstIndex = this.#codes.length;

    for (let i = 0; i < items.length; i++) {
      const code = randomCode() + i;
      this.#codes.push(code);
      this.#itemMap.set(code, {
        value: items[i],
        chanCode: randomCode(),
        code: code,
        listeners: new Emitter(),
        index: firstIndex + i,
      });
    }

    const indexs = Array(items.length)
      .fill(0)
      .map((v, i) => i + firstIndex);
    this.#onChange(indexs, ActionType.INSERT);
  }

  get(i: number): ObservableBase<T> {
    return this.#getItem(i);
  }

  swap(i: number, j: number) {
    const size = this.#codes.length;
    if (i < 0 || i >= size)
      this.error(`invalid index: i${i}, max index: ${size - 1}`);
    if (j < 0 || j >= size)
      this.error(`invalid index: ${j}, max index: ${size - 1}`);

    [this.#codes[i], this.#codes[j]] = [this.#codes[j], this.#codes[i]];

    this.#updateItemIndex(i, j);

    this.#onChange([i, j], ActionType.MOVE);
  }

  pop(): T | undefined {
    if (this.#codes.length === 0) return;

    const tempCode = this.#codes.pop();
    const lastIndex = this.length - 1;

    if (tempCode === undefined) return undefined;

    const item = this.#itemMap.get(tempCode);
    this.#itemMap.delete(tempCode);

    this.#onChange([lastIndex], ActionType.DELETE);
    return item?.value;
  }

  remove(index: number): T | undefined {
    if (index < 0 || index >= this.length) return;

    const removed = this.#codes.splice(index, 1);
    const code = removed[0];
    const item = this.#itemMap.get(code);
    this.#itemMap.delete(code);
    this.#updateAllItemIndex(index);
    this.#onChange([index], ActionType.DELETE);
    return item?.value;
  }

  error(msg: string): never {
    throw new Error(msg);
  }

  #updateItemIndex(...indexs: number[]) {
    for (const index of indexs) {
      const item = this.#itemMap.get(this.#codes[index]);
      if (item === undefined) {
        console.error('inconsistency found. An undefined code fiended.');
        // this.error('inconsistency found. An undefined code fiended.');
        continue;
      }
      item.index = index;
    }
  }

  #updateAllItemIndex(indexStart: number = 0) {
    if (indexStart < 0 || indexStart >= this.#codes.length) return;
    for (let index = indexStart; index < this.#codes.length; index++) {
      this.#updateItemIndex(index);
    }
  }

  #getItem(index: number): ObservableBase<T> {
    const code = this.#codes[index];
    const item = this.#itemMap.get(code);
    if (item === undefined) throw new Error('Err on get item');
    return this.#itemToObservable(item);
  }

  #itemToObservable(item: Item<T>): ObservableBase<T> {
    if (item.observableItem === undefined) {
      const self = this;
      item.observableItem = new (class extends ObservableBase<T> {
        get value() {
          return item.value as ReadOnlyDeep<T>;
        }
        get changeCode() {
          return item.chanCode;
        }

        listen(fn: ObservableListener<T>) {
          item.listeners.listen(fn);
          return () => {
            this.removeListener(fn);
          };
        }

        removeListener(fn: ObservableListener<T>) {
          item.listeners.removeListener(fn);
        }

        set(newValue: T, code?: string) {
          self.#setByCode(item.code, newValue, code);
        }
        change(fn: (prev: T) => T): void {
          const newValue = fn(item.value);
          self.#setByCode(item.code, newValue);
        }
      })();
    }

    return item.observableItem;
  }

  #onChange(indexs: number[], action: ActionType) {
    this.#notify(indexs, action);
    this.#notifyItemsChanges(indexs, action);
  }

  #notifyItemsChanges(indexs: number[], action: ActionType) {
    if (action !== ActionType.UPDATE) return;
    for (const index of indexs) {
      const code = this.#codes[index];
      if (!code) break;
      const item = this.#itemMap.get(code);
      item?.listeners.emit(item.value, undefined, item.chanCode);
    }
  }

  #notify(indexs: number[], action: ActionType) {
    const data: ChangInfo = {
      action,
      indexs,
    };
    this.emit(data);
  }
}
