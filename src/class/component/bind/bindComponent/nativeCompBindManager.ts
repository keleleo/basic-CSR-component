import { BindInfo } from '../../../../@types/bindInfo';
import { BindType } from '../../../../@types/bindType';
import { HtmlAttr } from '../../../../@types/htmlObject';
import { createProxy } from '../../../../utils/proxy';
import { ComponentBase } from '../../ComponentBase';

const { INPUT, OUTPUT, TWOWAY, NOBIND, FOR } = BindType;

export function nativeCompBindManager(
  root: ComponentBase,
  instance: any,
  el: HTMLElement,
  atts: HtmlAttr[]
): BindInfo {
  const bindInfo: BindInfo = {
    stopListener: [],
  };
  for (const att of atts) {
    const { bindType, methodValue } = att;
    if (bindType === NOBIND) {
      staticValue(el, att);
      continue;
    }

    if (isEventBind(att)) {
      bindEvent(instance, att, el);
      continue;
    }

    if (bindType === TWOWAY || bindType === INPUT)
      bindInput(root, el, att, instance, bindInfo);
    if (bindType === TWOWAY || bindType === OUTPUT)
      bindOutput(root, el, att, instance, bindInfo);
  }
  return bindInfo;
}

function staticValue(el: HTMLElement, att: HtmlAttr) {
  el.setAttribute(att.name, att.value);
}

function bindEvent(instance: any, att: HtmlAttr, el: HTMLElement) {
  el.addEventListener(att.name, (event) => {
    if (att.methodValue) {
      att.methodValue.execute(createProxy(instance, { $event: event }));
    }
    if (att.path) {
      const fn = att.path.extractValue(instance);
      fn.bind(instance)(event);
    }
  });
}

function bindInput(
  root: ComponentBase,
  el: HTMLElement,
  att: HtmlAttr,
  instance: any,
  bindInfo: BindInfo
) {
  const path = att.path;
  const methodValue = att.methodValue;

  if (path) {
    const fn = getFnSetValue(el, att, () => path.extractValue(instance));
    fn(); //Initialize value
    const stopListener = root.listenProperties(fn, path.root);
    bindInfo.stopListener.push(stopListener);
  }
  if (methodValue) {
    const fn = getFnSetValue(el, att, () => methodValue.execute(instance));
    fn(); //Initialize value
    if (methodValue.properties.length) {
      const stopListener = root.listenProperties(fn, ...methodValue.properties);
      bindInfo.stopListener.push(stopListener);
    }
  }
}

function getFnSetValue(el: HTMLElement, att: HtmlAttr, valueFn: () => any) {
  return () => {
    const value = valueFn();
    if (typeof value !== 'boolean') {
      setElValue(el, att.name, value);
      return;
    }

    if (value) el.setAttribute(att.name, '');
    else el.removeAttribute(att.name);
  };
}

function bindOutput(
  root: ComponentBase,
  el: HTMLElement,
  att: HtmlAttr,
  instance: any,
  bindInfo: BindInfo
) {
  const listener = attrListeners.get(att.name);
  if (!listener)
    root.elementErro(`Attribute: ${att.name} does not suport output bind`);

  const setFn = getSetRootValue(root, att, instance);

  el.addEventListener(listener.event, () => {
    setFn(listener.getValue(el));
  });
}

function getSetRootValue(root: ComponentBase, att: HtmlAttr, instance: any) {
  const path = att.path;
  if (path) {
    return (value: any) => {
      root.setPropertyValue(
        path.root,
        path.changeValue(instance[path.root], value)
      );
    };
  }
  const methodValue = att.methodValue;
  if (methodValue) {
    return (value: any) =>
      methodValue.execute(createProxy(instance, { $event: value }));
  }
  throw new Error('.');
}

function setElValue(el: HTMLElement, attName: string, value: any) {
  const setValFun = nativeSetValue.get(attName);
  if (setValFun) setValFun(value, el);
  else el.setAttribute(attName, value);
}

function isEventBind(att: HtmlAttr) {
  return att.bindType === BindType.OUTPUT && eventNames.has(att.name);
}

const nativeSetValue = new Map<String, (value: any, el: HTMLElement) => void>([
  [
    'value',
    (value: any, el: any) => {
      el.value = value;
    },
  ],
]);

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
