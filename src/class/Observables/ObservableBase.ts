import { ReadOnlyDeep } from '../../@types/readOnlyDeep';

export type ObservableListener<T> = (
  value: T,
  oldValue: T | undefined,
  changeCode: string
) => void;
export type ObservableStopListen = () => void;
export abstract class ObservableBase<T> {
  abstract get value(): ReadOnlyDeep<T>;
  abstract get changeCode(): string;
  abstract listen(fn: ObservableListener<T>): ObservableStopListen;
  abstract removeListener(fn: ObservableListener<T>): void;
  abstract set(newValue: T, changeCode?: string): void;
  abstract change(fn: (prev: T) => T): void;
}
