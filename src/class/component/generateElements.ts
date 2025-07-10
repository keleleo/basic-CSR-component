import { ElementsBinds } from '../../@types/Component/elementBindData';
import { HtmlObject, HtmlTextObject } from '../../@types/htmlObject';

type ElementType = HTMLElement | Text | Node;
type htmlObjectType = HtmlObject | HtmlTextObject;

export class GenerateElement {
  public static generate(
    htmlObject: htmlObjectType,
    ignoreFor: boolean = false
  ) {
    const binds: ElementsBinds = {
      elementsToBind: [],
      textBinds: [],
      forBind: [],
    };
    const element = this.generateElements(htmlObject, binds, ignoreFor);
    return { element, binds };
  }

  private static generateElements(
    htmlObject: HtmlObject | HtmlTextObject,
    binds: ElementsBinds,
    ignoreFor: boolean = false
  ): ElementType {
    if (htmlObject.type === 'Element') {
      if (htmlObject.forPropertyData && !ignoreFor)
        return this.processForBind(htmlObject, binds);
      return this.createElement(htmlObject, binds);
    }
    return this.createTextElement(htmlObject, binds);
  }

  private static processForBind(obj: HtmlObject, binds: ElementsBinds) {
    const forAtt = obj.forPropertyData;
    if (forAtt === undefined)
      throw new Error('Error on generate ForBind comment');
    const temp: Node = document.createComment(`Bind {${forAtt.name}}`);

    temp.parentElement;
    binds.forBind.push({
      target: temp,
      data: obj,
    });
    return temp;
  }

  private static createElement(
    obj: HtmlObject,
    binds: ElementsBinds
  ): HTMLElement {
    const element = document.createElement(obj.tag);

    if (!obj.isCustom) {
      obj.children.forEach((c) =>
        element.appendChild(this.generateElements(c, binds))
      );
    }

    binds.elementsToBind.push({
      el: element,
      atts: obj.attr,
      isCustom: obj.isCustom,
    });

    return element;
  }

  private static createTextElement(
    obj: HtmlTextObject,
    binds: ElementsBinds
  ): Text {
    const element = document.createTextNode(obj.text);

    if (obj.method) binds.textBinds.push({ text: element, method: obj.method });

    return element;
  }
}
