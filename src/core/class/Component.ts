import { HtmlAttr, HtmlObject, HtmlTextObject } from '../@types/htmlObject';
import { TextListener } from '../@types/textListener';
import { attFromPathAtt } from '../utils/attFromPathAtt';
import { objValueByPath } from '../utils/objValueByPath';
import { pathWithoutRootAtt } from '../utils/pathWithoutRootAtt';
import { customCompBindAtts } from './component.utils/customCompbindAtt';
import { nativeCompBindAtts } from './component.utils/nativeCompBindAtt';
import { ComponentBase } from './ComponentBase';

type BindData = {
  isCustom: boolean;
  el: HTMLElement;
  atts: HtmlAttr[];
};

export class Component<T> extends ComponentBase<T> {
  textListeners = new Map<string, TextListener[]>();
  elementsToBind: BindData[] = [];

  constructor(componentName: string, instance: T) {
    super(componentName, instance);
  }

  init(htmlObject: HtmlObject) {
    this.generateRootChrildren(htmlObject);
    this.initializeBindings();
    this.initializeTextBindings();
    this.notifyObservables();
  }

  private initializeBindings() {
    this.elementsToBind.forEach(({ el, atts }) => {
      if (el instanceof ComponentBase) customCompBindAtts(this, el, atts);
      else nativeCompBindAtts(this, el, atts);
    });
  }

  private initializeTextBindings() {
    for (const att of this.textListeners.keys()) {
      this.getObservable(att as any)?.listen((value) =>
        this.callTextListener(att, value)
      );
    }
  }

  private notifyObservables() {
    for (const obs of this.observables.values()) {
      obs.emit();
    }
  }

  private generateRootChrildren(htmlObject: HtmlObject) {
    htmlObject.children.forEach((htmlObject) => {
      const element = this.generateElements(htmlObject);
      this.appendChild(element);
    });
  }

  private generateElements(
    htmlObject: HtmlObject | HtmlTextObject
  ): HTMLElement | Text {
    if (htmlObject.type == 'Element') return this.generateElement(htmlObject);
    return this.generateTextElement(htmlObject);
  }

  private generateTextElement(obj: HtmlTextObject): Text {
    const element = document.createTextNode(obj.text);
    if (obj.bind) this.addTextListener(element, obj.bind);
    return element;
  }

  private generateElement(obj: HtmlObject): HTMLElement {
    const element = document.createElement(obj.tag);

    if (!obj.isCustom) {
      obj.children.forEach((c) =>
        element.appendChild(this.generateElements(c))
      );
    }
    this.checkForAttToBind(element, obj, obj.isCustom);

    return element;
  }

  private checkForAttToBind(
    element: HTMLElement,
    obj: HtmlObject,
    isCustom: boolean
  ) {
    // const atts: HtmlAttr[] = obj.attr.filter((f) => f.bindType != undefined);
    // if (atts.length)
    this.elementsToBind.push({
      el: element,
      atts: obj.attr,
      isCustom: isCustom,
    });
  }

  private addTextListener(text: Text, attrPath: string) {
    const att = attFromPathAtt(attrPath);
    const path = pathWithoutRootAtt(attrPath);
    this.validateAttName(att);
    const listener: TextListener = { path, text };

    if (!this.textListeners.has(att)) {
      this.textListeners.set(att, [listener]);
      return;
    }
    this.textListeners.get(att)?.push(listener);
  }

  private callTextListener(attr: string, value: any) {
    this.textListeners.get(attr)?.forEach((listener) => {
      const obj = objValueByPath(listener.path, value);
      const text = obj.toString();
      if (listener.text.textContent !== text) listener.text.textContent = text;
    });
  }
}
