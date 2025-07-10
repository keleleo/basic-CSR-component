import { ComponentDef } from '../@types/componentDef';
import { Component } from '../class/component/Component';
import { cssPrefix } from './cssPrefix';
import { HtmlParser } from './htmlparser/htmlParser';
import { minifyCSS } from './minifyCss';

let cachedStyle: HTMLStyleElement | undefined;

export function createComponent<T extends Object>({
  html,
  clazz,
  name,
  css,
}: ComponentDef<T>) {
  const htmlObject = HtmlParser.parse(html);
  if (css) setCss(css, name);
  class ComponentImp extends Component<T> {
    initialized = false;
    constructor() {
      super(name, new clazz());
      this.initComponentBase();
    }
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
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
