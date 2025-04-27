import { AttrListener } from '../@types/attrListener';
import { ObservableKeys } from '../@types/observableKeys';
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
          throw new Error('Duplicated attribute name');
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
  ): T[K] extends Observable<any> ? T[K] : Observable<any> {
    this.validateAttName(name as string);
    return this.observables.get(name as string) as T[K] & Observable<any>;
  }

  protected validateAttName(att: string) {
    if (!this.observables.has(att))
      throw new Error(`Att: ${att} does not exist on ${this.componentName}.`);
  }
}
