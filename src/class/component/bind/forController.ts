import { BindInfo } from '../../../@types/bindInfo';
import { HtmlObject } from '../../../@types/htmlObject';
import { Component } from '../Component';

type NodeData = {
  htmlElement: Node;
  index: number;
  bindInfo: BindInfo;
};
type ForData = {
  target: Node;
  htmlObject: HtmlObject;
  nodes: NodeData[];
};
//TODO: Imp initial value.
export class ForController {
  root: Component<any>;

  forElements = new Map<string, ForData[]>();

  constructor(root: Component<any>) {
    this.root = root;
  }

  addForElement(target: Node, htmlObject: HtmlObject) {
    if (!htmlObject.forPropertyData) return;
    const forData = this.createForData(target, htmlObject);
    // this.addForData
  }
  createForData(target: Node, htmlObject: HtmlObject): ForData {
    return {
      htmlObject,
      target,
      nodes: [],
    };
  }

  addForData(forData: ForData) {}
}
