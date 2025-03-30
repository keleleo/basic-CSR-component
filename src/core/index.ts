import { attrBind } from './bind/attr.bind';
import { eventBind } from './bind/event.bind';
import { textBind } from './bind/text.bind';

const parser = new DOMParser();
export function createComp(html: string, clazz: any, name: string) {
  class Component extends HTMLElement {
    funListeners = new Map<string, ((value: any) => void)[]>();
    instance = new clazz();
    constructor() {
      super();
      this.innerHTML = html;
      textBind(this, this.setFuncListener.bind(this));
      eventBind(this, this.instance);
      attrBind(this, this.setFuncListener.bind(this));
      this.initFunLValue();
      this.watchAttr();
    }

    watchAttr() {
      for (const key in this.instance) {
        const value = this.instance[key];
        const nKey = `#_watch_${key}`;

        Object.defineProperty(this.instance, nKey, {
          value: value,
          writable: true,
        });
        Object.defineProperty(this.instance, key, {
          set: (newValue) => {
            this.instance[nKey] = newValue;
            this.onchangeValue(key, newValue);
          },
          get: () => this.instance[nKey],
        });
      }
    }

    onchangeValue(attr: string, value: any) {
      this.changeFuncValue(attr, value);
    }

    changeFuncValue(attr: string, value: any) {
      this.funListeners.get(attr)?.forEach((fun) => {
        fun(value);
      });
    }
    setFuncListener(attr: string, fun: (value: any) => void) {
      if (!this.funListeners.has(attr)) this.funListeners.set(attr, []);
      this.funListeners.get(attr)?.push(fun);
    }

    initFunLValue() {
      for (const data of this.funListeners) {
        const key = data[0];
        data[1].forEach((fun) => {
          const t = fun.bind(this)(this.instance[key]);
        });
      }
    }
  }

  customElements.define(name, Component);
}
