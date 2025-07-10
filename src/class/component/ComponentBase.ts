import { randomCode } from '../../utils/randomCode';
import { Emitter } from '../Emitter';
type PropertyListener = (value: any, changeCode: string) => void;
type Property = {
  value: any;
  changeCode: string;
  listeners: Emitter<PropertyListener>;
};
export class ComponentBase<T extends Object = any> extends HTMLElement {
  #name: string;
  properties = new Map<string, Property>();
  instance: T;
  get name() {
    return this.#name;
  }

  constructor(name: string, instance: T) {
    super();
    this.instance = instance;
    this.#name = name;
  }

  protected initComponentBase() {
    this.whatchProperties();
  }

  private whatchProperties() {
    for (const name in this.instance) {
      if (name.startsWith('$')) continue;
      this.addProperty(name, this.instance[name]);
      Object.defineProperty(this.instance, name, {
        set: (nValue) => this.setPropertyValue(name, nValue),
        get: () => this.getPropertyValue(name),
      });
    }
  }

  private addProperty(name: string, value: any) {
    const property: Property = {
      value,
      changeCode: `${name}-initial-value`,
      listeners: new Emitter(),
    };
    this.properties.set(name, property);
  }

  public getPropertyValue(name: string): any {
    if (name.startsWith('$')) {
      return (this.instance as any)[name];
    }
    return this.properties.get(name)?.value;
  }

  public setPropertyValue(name: string, value: any, changeCode?: string) {
    if (name.startsWith('$'))
      this.elementErro(`Cannot set values for the static property '${name}'.`);

    const property = this.properties.get(name);
    if (!property) this.elementErro(`Property ${name} does not exists`);
    if (changeCode === property.changeCode) return;

    property.changeCode = changeCode || randomCode();
    property.value = value;
    property.listeners.emit(property.value, property.changeCode);
  }

  public listenProperties(fn: PropertyListener, ...names: string[]) {
    const stopListen = names
      .map((name) => this.listenProperty(fn, name))
      .filter((f) => f !== undefined);
    return () => {
      stopListen.forEach((fn) => fn());
    };
  }

  public listenProperty(fn: PropertyListener, name: string) {
    if (name.startsWith('$')) return;
    const property = this.properties.get(name);
    if (!property) this.elementErro(`Property ${name} does not exists`);
    return property.listeners.listen(fn);
  }

  public elementErro(msg: string): never {
    throw new Error(`${this.name}. ${msg}`);
  }
}
