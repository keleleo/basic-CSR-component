import { Observable } from '../class/Observable';

export type ObservableKeys<T> = {
  [K in keyof T]: T[K] extends Observable<any> ? K : never;
}[keyof T];
