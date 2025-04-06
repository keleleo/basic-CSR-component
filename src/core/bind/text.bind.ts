import { objValueByPath } from '../utils/objValueByPath';

export function textBind(el: Element, setFuncListener: any) {
  const els = el.querySelectorAll('*');
  for (const el of els) {
    const child = el.childNodes;
    for (const c of child) {
      bindTextAttr(c, setFuncListener);
    }
  }

  for (const e of el.childNodes) {
    if (e.nodeType != 3) continue;
    bindTextAttr(e, setFuncListener);
  }
}

function bindTextAttr(node: ChildNode, setFuncListener: any) {
  const regex_attr = /\{\{[a-zA-Z0-9_$.]+\}\}(?!\S)/; //Find {{text}}
  if (node.nodeType !== 3) return;

  const str = node.textContent;
  if (!str || str.trim() == '' || !regex_attr.test(str)) return;

  const regex_attr_piece = /[^{}]+|\{\{[a-zA-Z0-9_$.]+\}\}/g;
  const parts = str.match(regex_attr_piece);

  if (!parts) return;
  const nodes: any[] = [];

  for (const part of parts) {
    const txtNode = document.createTextNode(part);
    nodes.push(txtNode);
    if (regex_attr.test(part)) {
      const attrVal = getAttr(part);
      const attrName = attrVal.split('.')[0];
      const path = getPath(attrVal);
      txtNode.textContent = '';
      setFuncListener(attrName, (value: any) => {
        txtNode.textContent = valueToString(value, path);
        return txtNode;
      });
    }
  }

  if (nodes.length == 0) return;
  nodes.forEach((n) => {
    node.parentElement?.insertBefore(n, node);
  });

  node.parentElement?.removeChild(node);
}
function getAttr(str: string) {
  return str.replace('{{', '').replace('}}', '');
}
function getPath(str: string) {
  const i = str.indexOf('.');
  return i == -1 ? '' : str.slice(i + 1);
}

function valueToString(val: any, path: string) {
  if (typeof val === 'string' || typeof val === 'number') return val.toString();
  if (typeof val === 'object') {
    return objValueByPath(path, val)?.toString();
  }
  return val;
}
