import { ComponentDef } from './@types/componentDef';
import { Component } from './class/Component';
import { cssPrefix } from './utils/cssPrefix';
import { htmlParser } from './utils/htmlParser';
import { minifyCSS } from './utils/minifyCss';

let cachedStyle: HTMLStyleElement | undefined;

export function createComponent<T>({
  html,
  clazz,
  name,
  css,
}: ComponentDef<T>) {
  const htmlObject = htmlParser(html);
  if (css) setCss(css, name);
  class ComponentImp extends Component {
    constructor() {
      super(name);
      this.instance = new clazz();
      this.initComponentBase();
      // this.classList.add(name);
    }
    connectedCallback() {
      this.init(htmlObject);
    }
  }
  customElements.define(name, ComponentImp);
}

function setCss(rawCss: string, elementName: string) {
  if (!cachedStyle) {
    cachedStyle = document.createElement('style');
    document.head.appendChild(cachedStyle);
  }
  const css = minifyCSS(cssPrefix(elementName, rawCss));
  cachedStyle.textContent += '\n' + css;
}
