export type ComponentDef<T> = {
  html: string;
  clazz: new () => T;
  name: string;
  css?: string;
};
