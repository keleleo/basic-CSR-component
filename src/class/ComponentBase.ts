import { AttrListener } from '../@types/attrListener';
import { FunctionKeys } from '../@types/keys/functionKeys';
import { ObservableKeys } from '../@types/keys/observableKeys';
import { Observable } from './Observable';

export class ComponentBase<T = any> extends HTMLElement {
  componentName: string;
  observables = new Map<string, Observable<any>>();
  attListeners = new Map<string, AttrListener[]>();
  instance: T;

  constructor(componentName: string, instance: T) {
    super();
    this.instance = instance;
    this.componentName = componentName;
  }

  protected initComponentBase() {
    this.registerAttributeObservables();
  }

  private registerAttributeObservables() {
    for (const attName in this.instance) {
      const att = this.instance[attName];
      if (att instanceof Observable) {
        if (this.observables.has(attName))
          throw new Error(
            `${attName}, Duplicated attribute name on ${this.componentName}`
          );
        this.observables.set(attName, att);
      }
    }
  }

  /**
   *
   * @param name Observables name
   * @returns Observables from <T>
   */
  public getObservable<K extends ObservableKeys<T>>(
    name: K
  ): ObservableType<T, K> {
    this.validateAttName(name as string);
    return this.observables.get(name as string) as T[K] & Observable<any>;
  }

  public getMethod<K extends FunctionKeys<T>>(name: K): Function {
    const method = this.instance[name as keyof T];
    if (typeof method != 'function')
      throw new Error(this.propertyNotFoundMsg(name.toString()));
    return method.bind(this.instance);
  }

  protected validateAttName(att: string) {
    if (!this.observables.has(att))
      throw new Error(this.propertyNotFoundMsg(att));
  }

  private propertyNotFoundMsg(name: string) {
    return `Property: ${name} does not exist on ${this.componentName}.`;
  }
}

type ObservableType<T, K extends keyof T> = 0 extends 1 & T
  ? Observable<any>
  : T[K] extends Observable<any>
    ? T[K]
    : Observable<any>;
