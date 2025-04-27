export type ReadOnlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadOnlyDeep<T[P]> : T[P];
};
