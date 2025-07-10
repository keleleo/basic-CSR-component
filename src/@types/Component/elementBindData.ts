import { HtmlAttr, HtmlMethod, HtmlObject } from '../htmlObject';

export type AttributeBinds = {
  isCustom: boolean;
  el: HTMLElement;
  atts: HtmlAttr[];
};

export type TextBind = {
  method: HtmlMethod;
  text: Text;
};

export type ElementsBinds = {
  elementsToBind: AttributeBinds[];
  textBinds: TextBind[];
  forBind: { target: Node; data: HtmlObject }[];
};
