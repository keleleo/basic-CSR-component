import { BindType } from '../../@types/bindType';
import { HtmlAttr } from '../../@types/htmlObject';
import { attFromPathAtt } from '../../utils/attFromPathAtt';
import { changeValueByPath } from '../../utils/changeValueByPath';
import { objValueByPath } from '../../utils/objValueByPath';
import { pathWithoutRootAtt } from '../../utils/pathWithoutRootAtt';
import { ComponentBase } from '../ComponentBase';

export function nativeCompBindAtts(
  root: ComponentBase,
  el: HTMLElement,
  atts: HtmlAttr[]
) {
  atts.forEach((att) => {
    if (!att.bindType) basicBind(el, att);
    else if (isEventBind(att)) bindEvent(root, el, att);
    else if (att.bindType == BindType.INPUT) bindSet(root, el, att);
    else if (att.bindType == BindType.TWOWAY) bindTwoWay(root, el, att);
  });
}
function bindSet(root: ComponentBase, el: HTMLElement, att: HtmlAttr) {
  const rootAttr = attFromPathAtt(att.value);
  const pathWithoutRoot = pathWithoutRootAtt(att.value);

  root.getObservable(rootAttr).listen((value) => {
    const valueFromPath = objValueByPath(pathWithoutRoot, value);
    if (typeof valueFromPath !== 'boolean') {
      el.setAttribute(att.name, valueFromPath);
      return;
    }

    if (valueFromPath) el.setAttribute(att.name, '');
    else el.removeAttribute(att.name);
  });
}

function basicBind(el: HTMLElement, att: HtmlAttr) {
  el.setAttribute(att.name, att.value);
}

function bindEvent(root: ComponentBase, el: HTMLElement, att: HtmlAttr) {
  const fun: Function = root.getMethod(att.value);
  el.addEventListener(att.name, () => fun());
}

function bindTwoWay(root: ComponentBase, el: HTMLElement, att: HtmlAttr) {
  const rootAttr = attFromPathAtt(att.value);
  const pathWithoutRoot = pathWithoutRootAtt(att.value);

  const listener = attrListeners.get(att.name);
  const obs = root.getObservable(rootAttr);

  if (!listener)
    throw new Error(
      `${root.componentName} - attribute ${att.name} does not suport towway bind`
    );

  bindSet(root, el, att);
  el.addEventListener(listener.event, () => {
    const value = listener.getValue(el);
    obs.change((prev) => {
      const nV = changeValueByPath(prev, pathWithoutRoot, value);
      console.log(nV, value);
      return nV;
    });
  });
}

function isEventBind(att: HtmlAttr) {
  return att.bindType == BindType.INPUT && eventNames.has(att.name);
}

const attrListeners = new Map<string, NativeAttrListener>([
  [
    'value',
    { event: 'input', getValue: (el) => (el as HTMLInputElement).value },
  ],
  [
    'checked',
    { event: 'change', getValue: (el) => (el as HTMLInputElement).checked },
  ],
  [
    'selectedIndex',
    {
      event: 'change',
      getValue: (el) => (el as HTMLSelectElement).selectedIndex,
    },
  ],
  [
    'files',
    { event: 'change', getValue: (el) => (el as HTMLInputElement).files },
  ],
]);

const eventNames = new Set([
  'click',
  'change',
  'input',
  'submit',
  'reset',
  'focus',
  'blur',
  'keydown',
  'keyup',
  'keypress',
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'mouseover',
  'mouseout',
  'contextmenu',
  'drag',
  'dragstart',
  'dragend',
  'dragenter',
  'dragleave',
  'dragover',
  'drop',
  'scroll',
  'resize',
  'load',
  'unload',
  'abort',
  'error',
  'wheel',
  'animationstart',
  'animationend',
  'animationiteration',
  'transitionend',
  'touchstart',
  'touchmove',
  'touchend',
]);

type NativeAttrListener = {
  event: string;
  getValue: (el: HTMLElement) => any;
};
