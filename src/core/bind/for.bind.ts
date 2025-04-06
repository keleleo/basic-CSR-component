import { ComponentBase } from '../ComponentBase';
import { deepEqual } from '../utils/equals';
import { objValueByPath } from '../utils/objValueByPath';
type Data = {
  element: ComponentBase;
  oldValue: any;
};
export function forBind(root: ComponentBase) {
  const elements = Array.from(root.querySelectorAll(`[child-${root.code}]`));
  elements.forEach((el) => processElement(root, el));
}

function processElement(root: ComponentBase, el: Element) {
  const forList = el.getAttribute('*for');
  const forKey = el.getAttribute('*key') || '';
  if (forList == null) return;
  if (!(el instanceof ComponentBase))
    throw new Error(el.tagName + ' is not a instance of ComponentBase');

  bind(root, el, forList, forKey);
}

function bind(
  root: ComponentBase,
  el: ComponentBase,
  forList: string,
  forKey: string
) {
  const map = new Map<string, Data>();
  const comment = document.createComment(`for-placeholder: ${forList}`);
  const template = el.cloneNode(false) as ComponentBase;
  root.insertBefore(comment, el);
  root.removeChild(el);

  root.addAttrListener(forList, (list) => {
    if (!(list instanceof Array)) return;
    const currentKeys = new Set(map.keys());
    list.forEach((value) => {
      const key = getKeyValue(forKey, value);
      if (currentKeys.delete(key)) {
        updateValue(key, value, map);
      } else {
        createEl(template, key, root, comment, map);
        updateValue(key, value, map);
      }
    });

    currentKeys.forEach((key) => {
      const data = map.get(key);
      if (!data) return;
      root.removeChild(data.element);
      map.delete(key);
    });
  });
}

function updateValue(key: string, value: any, map: Map<string, Data>) {
  const data = map.get(key);
  if (!data) return;
  console.log(data.oldValue, value);

  if (deepEqual(data.oldValue, value)) return;
  data.oldValue = value;
  data.element.setAttrValue('$item', value);
}

function createEl(
  template: ComponentBase,
  key: string,
  root: ComponentBase,
  comment: Comment,
  map: Map<string, Data>
) {
  const temp = template.cloneNode(false) as ComponentBase;
  root.insertBefore(temp, comment);
  map.set(key, {
    element: temp,
    oldValue: null,
  });
}

function getKeyValue(path: string, obj: any) {
  if (path.startsWith('$item')) path = path.slice(5);
  if (path.startsWith('.')) path = path.slice(1);

  return path.length == 0
    ? obj.toString()
    : objValueByPath(path, obj)?.toString();
}
