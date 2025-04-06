import { ComponentBase } from './ComponentBase';

export function createComp(html: string, clazz: any, name: string) {
  class Component extends ComponentBase {
    constructor() {
      super();
      this.instance = new clazz();
      this.code = Math.random().toString().slice(4, 10);
      this.innerHTML = html.replace(
        /<(\w+)([^>]*?)(\/?)>/g,
        `<$1$2 child-${this.code}$3>`
      );
      this.setAttribute(`code-${this.code}`, '');
    }
    connectedCallback() {
      this.init();
    }
  }
  customElements.define(name, Component);
}
