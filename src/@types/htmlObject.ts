import { BindType } from './bindType';

export type HtmlObject = {
  tag: string;
  attr: HtmlAttr[];
  type: 'Element';
  isCustom: boolean;
  children: (HtmlObject | HtmlTextObject)[];
};

export type HtmlTextObject = {
  text: string;
  type: 'Text';
  bind?: string | undefined;
};

export type HtmlAttr = {
  name: string;
  value: string;
  bindType: BindType | undefined;
};
