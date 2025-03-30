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
  const regex_attr = /\{\{[a-zA-Z0-9_]+\}\}(?!\S)/; //Find {{text}}
  if (node.nodeType !== 3) return;

  const str = node.textContent;

  if (!str || str.trim() == '' || !regex_attr.test(str)) return;

  const regex_attr_piece = /[^{}]+|\{\{[a-zA-Z0-9_]+\}\}/g;
  const parts = str.match(regex_attr_piece);

  if (!parts) return;
  const nodes: any[] = [];

  for (const part of parts) {
    const txtNode = document.createTextNode(part);
    nodes.push(txtNode);
    if (regex_attr.test(part)) {
      const attr = part.replace('{{', '').replace('}}', '');
      txtNode.textContent = '';

      setFuncListener(attr, (value: any) => {
        txtNode.textContent = value + '';
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
