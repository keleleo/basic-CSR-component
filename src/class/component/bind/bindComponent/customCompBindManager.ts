import { BindInfo } from '../../../../@types/bindInfo';
import { BindType } from '../../../../@types/bindType';
import { HtmlAttr } from '../../../../@types/htmlObject';
import { createProxy } from '../../../../utils/proxy';
import { Emitter } from '../../../Emitter';
import { ComponentBase } from '../../ComponentBase';

const { INPUT, OUTPUT, TWOWAY, NOBIND, FOR } = BindType;
export function customCompBindManager(
  root: ComponentBase,
  instance: any,
  el: ComponentBase,
  atts: HtmlAttr[]
): BindInfo {
  const bindInfo: BindInfo = {
    stopListener: [],
  };

  for (const att of atts) {
    if (att.bindType === NOBIND) {
      applyStaticValue(el, att);
      continue;
    }

    if (isEvent(root, el, att)) {
      eventBind(root, instance, el, att);
      continue;
    }

    bindAttribute(root, instance, bindInfo, el, att);
  }
  return bindInfo;
}

function applyStaticValue(el: ComponentBase, att: HtmlAttr) {
  const value = getStaticValue(att.value);
  el.setPropertyValue(att.name, value);
}

function isEvent(
  root: ComponentBase,
  el: ComponentBase,
  att: HtmlAttr
): boolean {
  const propValue = el.instance[att.name];
  if (!(propValue instanceof Emitter)) return false;
  if (att.bindType !== OUTPUT) invalidBindTypeForInput(root, el, att);
  return true;
}

function eventBind(
  root: ComponentBase,
  instance: any,
  el: ComponentBase,
  att: HtmlAttr
) {
  const emitter = el.instance[att.name];
  if (!(emitter instanceof Emitter)) return;
  const listener = (...args: any) => {
    if (att.path) {
      const fn = att.path.extractValue(root.instance);
      fn.bind(instance)(...args);
    }
    if (att.methodValue) {
      att.methodValue.execute(createProxy(instance, { $event: args }));
    }
  };

  emitter.listen(listener);
}

function getStaticValue(value: string) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  const num = Number(value);
  if (!Number.isNaN(num)) return num;
  return value.toString();
}

function bindAttribute(
  root: ComponentBase,
  instance: any,
  bindInfo: BindInfo,
  el: ComponentBase,
  att: HtmlAttr
) {
  if (att.bindType === INPUT || att.bindType === TWOWAY)
    inputBind(root, bindInfo, instance, el, att);
  if (att.bindType === OUTPUT || att.bindType === TWOWAY)
    bindOutPut(root, bindInfo, instance, el, att);
}
/**
 *
 * @description [] - root -> child
 */
function inputBind(
  root: ComponentBase,
  bindInfo: BindInfo,
  instance: any,
  el: ComponentBase,
  att: HtmlAttr
) {
  let fnReturnValue: (() => any) | null = null;
  let properties: string[] | null = null;

  if (att.path != undefined) {
    const path = att.path;
    fnReturnValue = () => path.extractValue(instance);
    properties = [path.root];
  }
  if (att.methodValue) {
    const methodValue = att.methodValue;
    fnReturnValue = () => methodValue.execute(instance);
    properties = methodValue.properties;
  }

  if (!fnReturnValue || !properties)
    root.elementErro(`Error configure InputBind`);

  const functionSetValue = getFunctionSetValue(el, att, fnReturnValue);
  const stopLisner = root.listenProperties(functionSetValue, ...properties);
  functionSetValue(null);
  bindInfo.stopListener.push(stopLisner);
}

function getFunctionSetValue(
  el: ComponentBase,
  att: HtmlAttr,
  valueFn: () => any
) {
  return (_: any, code?: string) => {
    const value = valueFn();
    el.setPropertyValue(att.name, value, code);
  };
}

/**
 *
 * @description () - child -> root
 */
function bindOutPut(
  root: ComponentBase,
  bindInfo: BindInfo,
  instance: any,
  el: ComponentBase,
  att: HtmlAttr
) {
  el.listenProperty((value, code) => {
    if (att.path) {
      root.setPropertyValue(
        att.path.root,
        att.path.changeValue(instance[att.path.root], value),
        code
      );
    }
    if (att.methodValue) {
      att.methodValue.execute(createProxy(instance, { $event: value }));
    }
  }, att.name);
}

function invalidBindTypeForInput(
  root: ComponentBase,
  el: ComponentBase,
  att: HtmlAttr
): never {
  root.elementErro(
    `Invalid event binding on element <${el.name}>: attribute "${att.name}"` +
      ` must use output binding syntax (e.g., (event)).`
  );
}
