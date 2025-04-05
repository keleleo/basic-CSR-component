import { ComponentBase } from '../ComponentBase';
export function propBind(root: ComponentBase) {
  const c = `[child-${root.code}]`;
  const select = `input${c}, textarea${c},select${c}`;
  const targets = root.querySelectorAll(select);

  targets.forEach((el) => {
    const setAttr = el.getAttribute('(value)');
    const getAttr = el.getAttribute('[value]');
    const twoWay = el.getAttribute('[(value)]');
    if (setAttr) bindSet(root, el, setAttr);
    if (getAttr) bindGet(root, el, getAttr);
    if (twoWay) {
      bindSet(root, el, twoWay);
      bindGet(root, el, twoWay);
    }
  });
}

function bindSet(root: ComponentBase, el: Element, attrValue: string) {
  if (!isInput(el)) return;
  root.addAttrListener(attrValue, (value) => {
    el.value = value;
  });
}
function bindGet(root: ComponentBase, el: Element, attrValue: string) {
  el.addEventListener('input', (event) => {
    const target = event.target;
    if (!isInput(target)) return;
    root.setAttrValue(attrValue, target.value);
  });
}

function isInput(
  el: any
): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement
  );
}
