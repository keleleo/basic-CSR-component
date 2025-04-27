import { AttrListener } from '../@types/attrListener';
import { Observable } from './Observable';

export class ComponentBase extends HTMLElement {
  componentName: string;
  observables = new Map<string, Observable<any>>();
  attListeners = new Map<string, AttrListener[]>();
  instance: any;

  constructor(componentName: string) {
    super();
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

  public getObservable(name: string): Observable<any> {
    this.validateAttName(name);
    return this.observables.get(name) as Observable<any>;
  }

  protected validateAttName(att: string) {
    if (!this.observables.has(att))
      throw new Error(`Att: ${att} does not exist on ${this.componentName}.`);
  }
}
