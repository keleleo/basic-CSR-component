import { ComponentBase } from '../ComponentBase';

export function attrBind(root: ComponentBase) {
  const targets = root.querySelectorAll(`[child-${root.code}]`);

  for (const el of targets) {
    if (!el.tagName.includes('-')) continue;
    doAttrBind(root, el);
  }
}

export function doAttrBind(root: ComponentBase, el: Element) {
  Array.from(el.attributes).forEach((attr) => {
    const attrTarget = attr.name.replace(/[\[\]\(\)]/g, '');
    const attrRoot = attr.value;

    // customElements
    //   .whenDefined(el.tagName.toLowerCase())
    //   .then((res) => console.log(el.tagName.toLowerCase(), 'loaded'));

    if (!isComponentBase(el)) {
      return;
    }

    if (isTwoWay(attr.name)) {
      bindSet(root, el, attrTarget, attrRoot);
      bindGet(root, el, attrTarget, attrRoot);
      return;
    }
    if (isSet(attr.name)) bindSet(root, el, attrTarget, attrRoot);
    if (isGet(attr.name)) bindGet(root, el, attrTarget, attrRoot);
  });
}
function bindSet(
  root: ComponentBase,
  el: ComponentBase,
  attrTarget: string,
  attrRoot: string
) {
  root.addAttrListener(attrRoot, (value) => {
    el.setAttrValue(attrTarget, value);
  });
}

function bindGet(
  root: ComponentBase,
  el: ComponentBase,
  attrTarget: string,
  attrRoot: string
) {
  el.addAttrListener(attrTarget, (value) => {
    root.setAttrValue(attrRoot, value);
  });
}

function isGet(str: string) {
  return str.startsWith('[') && str.endsWith(']');
}
function isSet(str: string) {
  return str.startsWith('(') && str.endsWith(')');
}
function isTwoWay(str: string) {
  return str.startsWith('[(') && str.endsWith(')]');
}

function isComponentBase(el: any): el is ComponentBase {
  return el instanceof ComponentBase;
}
