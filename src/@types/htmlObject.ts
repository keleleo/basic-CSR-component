import { ObjectPath } from '../class/objectPath';
import { BindType } from './bindType';

export type HtmlObject = {
  tag: string;
  attr: HtmlAttr[];
  type: 'Element';
  isCustom: boolean;
  forPropertyData?: HtmlForPropertyData;
  children: (HtmlObject | HtmlTextObject)[];
};

export type HtmlForPropertyData = {
  name: string;
  // path: ObjectPath;
  valueWithContext: HtmlMethod;
  indexVar?: string;
};
export type HtmlTextObject = {
  text: string;
  type: 'Text';
  method?: HtmlMethod;
  // bind?: ObjectPath | undefined;
};

export type HtmlAttr = {
  name: string;
  value: string;
  methodValue?: HtmlMethod;
  path?: ObjectPath;
  bindType: BindType;
};

export type HtmlMethod = {
  properties: string[];
  execute: (context: any) => any;
};
