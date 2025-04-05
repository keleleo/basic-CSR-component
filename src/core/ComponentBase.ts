import { attrBind } from './bind/attr.bind';
import { eventBind } from './bind/event.bind';
import { propBind } from './bind/prop.bind';
import { textBind } from './bind/text.bind';

export class ComponentBase extends HTMLElement {
  code = '';
  attrListeners = new Map<string, ((value: any) => void)[]>();
  attrNames = new Set<string>();
  instance: any;

  constructor() {
    super();
  }

  init() {
    this.loadAttrNames();
    textBind(this, this.addAttrListener.bind(this));
    eventBind(this, this.instance);
    propBind(this);
    attrBind(this);
    this.watchAttr();
    this.callAllListeners();
  }

  callGetter(attr: string) {
    const getterName = 'get' + this.upperFistChar(attr);
    const getterFun = this.instance[getterName];
    if (typeof getterFun !== 'function') return undefined;
    return getterFun();
  }

  callSetter(attr: string, value: any) {
    const setterName = 'set' + this.upperFistChar(attr);
    const setterFun = this.instance[setterName];
    if (typeof setterFun !== 'function') return;
    setterFun();
  }

  upperFistChar(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  setAttrValue(attr: string, value: any) {
    if (!this.existAttr(attr)) throw new Error('Attribute not found: ' + attr);
    this.instance[attr] = value;
  }

  getAttrValue(attr: string) {
    if (!this.existAttr(attr)) throw new Error('Attribute not found: ' + attr);
    return this.instance[attr];
  }

  addAttrListener(attr: string, fun: (value: any) => void) {
    if (!this.existAttr(attr) && !this.instance[attr]) {
      console.log(attr, this.instance, this);
      throw new Error('Attribute not found: ' + attr);
    }
    if (!this.attrListeners.has(attr)) this.attrListeners.set(attr, []);
    this.attrListeners.get(attr)?.push(fun);
  }

  existAttr(attr: string) {
    return this.attrNames.has(attr);
  }

  private loadAttrNames() {
    Object.keys(this.instance).forEach((v) => {
      this.attrNames.add(v);
    });
  }

  private watchAttr() {
    for (const key in this.instance) {
      const value = this.instance[key];
      const nKey = `#_watch_${key}`;

      Object.defineProperty(this.instance, nKey, {
        value: value,
        writable: true,
      });
      Object.defineProperty(this.instance, key, {
        set: (newValue) => {
          if (this.instance[nKey] == newValue) return;

          this.instance[nKey] = newValue;
          this.onChangeAttrValue(key, newValue);

          if (this.instance['onChangeValue'])
            this.instance['onChangeValue'](key, {
              old: this.instance[nKey],
              newValue,
            });
        },
        get: () => this.instance[nKey],
      });
    }
  }

  private onChangeAttrValue(attr: string, value: any) {
    this.callAttrListeners(attr, value);
  }

  private callAttrListeners(attr: string, value: any) {
    this.attrListeners.get(attr)?.forEach((fun) => {
      fun(value);
    });
  }

  private callAllListeners() {
    for (const data of this.attrListeners) {
      const key = data[0];
      data[1].forEach((fun) => {
        const t = fun.bind(this)(this.instance[key]);
      });
    }
  }
}
