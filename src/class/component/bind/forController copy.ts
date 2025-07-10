// import { BindInfo } from '../../../@types/bindInfo';
// import { AttributeBinds } from '../../../@types/Component/elementBindData';
// import { HtmlObject } from '../../../@types/htmlObject';
// import { ActionType } from '../../../@types/observableArray/actionType';
// import { ChangInfo } from '../../../@types/observableArray/changeInfo';
// import { objValueByPath } from '../../../utils/objValueByPath';
// import { ObservableArray } from '../../Observables/ObservableArray';
// import { Component } from '../Component';
// import { GenerateElement } from '../generateElements';
// import { bindAtt } from './bindAtt';

// type NodeData = {
//   htmlElement: Node;
//   index: number;
//   bindInfo: BindInfo;
// };
// type ForData = {
//   target: Node;
//   htmlObject: HtmlObject;
//   nodes: NodeData[];
// };
// //TODO: Imp initial value.
// export class ForController {
//   root: Component<any>;

//   forElements = new Map<string, ForData[]>();

//   constructor(root: Component<any>) {
//     this.root = root;
//   }

//   addForElement(target: Node, htmlObj: HtmlObject) {
//     const forData = htmlObj.forPropertyData;
//     if (!forData) return;
//     const varName = forData.path.root;
//     if (!this.forElements.has(varName)) this.forElements.set(varName, []);
//     this.forElements.get(varName)?.push({
//       htmlObject: htmlObj,
//       target: target,
//       nodes: [],
//     });
//   }

//   onChangeArray(name: string, info: ChangInfo) {
//     const datas = this.forElements.get(name);
//     if (!datas) return;

//     for (const data of datas) {
//       if (info.action === ActionType.INSERT) this.doInsert(data, info);
//       if (info.action === ActionType.DELETE) this.doDelete(data, info);
//       if (info.action === ActionType.MOVE) this.doMove(data, info);
//     }
//   }

//   private doMove(data: ForData, info: ChangInfo) {
//     if (info.indexs.length !== 2) return;
//     const i1 = Math.max(info.indexs[0], info.indexs[1]);
//     const i2 = Math.min(info.indexs[0], info.indexs[1]);
//     const parent = data.target.parentElement;
//     if (parent == null) return;
//     const nodes = ([data.nodes[i1], data.nodes[i2]] = [
//       data.nodes[i2],
//       data.nodes[i1],
//     ]);
//     nodes[0].index = i1;
//     nodes[1].index = i2;
//     const el1 = nodes[0].htmlElement;
//     const el2 = nodes[1].htmlElement;
//     const nextEl1 = el1.nextSibling;
//     const nextEl2 = el2.nextSibling;

//     if (nextEl1 == null || nextEl2 == null) return;

//     parent.insertBefore(el2, el1);

//     if (el1 !== nextEl2 && el2 !== nextEl1) {
//       parent.insertBefore(el1, nextEl2);
//     }
//   }

//   private doDelete(data: ForData, info: ChangInfo) {
//     for (let ci = 0; ci < info.indexs.length; ci++) {
//       const index = info.indexs[ci];
//       const node = data.nodes[index];
//       const parent = node.htmlElement.parentElement;
//       parent?.removeChild(node.htmlElement);
//       data.nodes.splice(index, 1);
//       this.onDeleteNode(node);
//     }
//   }

//   private onDeleteNode(node: NodeData) {
//     for (const stopListener of node.bindInfo.stopListener) {
//       stopListener();
//     }
//   }

//   private doInsert(data: ForData, info: ChangInfo) {
//     for (let i = 0; i < info.indexs.length; i++) {
//       const {
//         element,
//         binds: { elementsToBind },
//       } = GenerateElement.generate(data.htmlObject, true);
//       const nodeData = this.addElementToMap(data, element);

//       const parent = data.target.parentElement;
//       parent?.insertBefore(element, data.target);
//       /* Não tratado o textBind e forBind */
//       this.doBind(data, elementsToBind, nodeData);
//     }
//   }

//   private addElementToMap(data: ForData, element: Node) {
//     const nodeData = this.createNodeData(data, element);
//     data.nodes.push(nodeData);
//     return nodeData;
//   }

//   private createNodeData(data: ForData, element: Node): NodeData {
//     const s = data.nodes.length;
//     return {
//       htmlElement: element,
//       index: s,
//       bindInfo: { stopListener: [] },
//     };
//   }

//   private doBind(
//     data: ForData,
//     elementsToBind: AttributeBinds[],
//     nodeData: NodeData
//   ) {
//     const tempGetProp = (n: string) => this.getProperty(data, n, nodeData);
//     for (const { el, atts } of elementsToBind) {
//       const bindInfo = bindAtt(this.root, el, atts, tempGetProp);
//       nodeData.bindInfo.stopListener.push(...bindInfo.stopListener);
//     }
//   }

//   private getProperty(data: ForData, name: string, nodeData: NodeData) {
//     const propData = data.htmlObject.forPropertyData;
//     if (!propData || name !== propData.name) {
//       return this.root.getProperty(name);
//     }
//     const arr = this.root.getProperty(propData.path.root);
//     const index = nodeData.index;
//     if (!(arr instanceof ObservableArray))
//       this.root.elementErro(`${propData.path.root} is not a ObservableArray`);
//     const value = arr.get(index);
//     return objValueByPath(propData.path, value);
//   }
// }
