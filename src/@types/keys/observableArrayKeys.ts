import { ObservableArray } from '../../class/Observables/ObservableArray';

export type ObservableArrayKeys<T> = {
  [K in keyof T]: T[K] extends ObservableArray<any> ? K : never;
}[keyof T];
