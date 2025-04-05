import { ComponentBase } from '../ComponentBase';

const eventList = [
  'click',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
];

export function eventBind(root: ComponentBase, instance: any) {
  for (const name of eventList) {
    const els = root.querySelectorAll(
      `[child-${root.code}][${name}]`
    ) as NodeListOf<HTMLElement>;

    for (const el of els) {
      const clickStr = el.getAttribute(name);
      if (!clickStr) continue;
      const funcName = clickStr.split('(')[0];
      const params = clickStr
        .replace(funcName, '')
        .replace('(', '')
        .replace(')', '')
        .split(',');
      setListener(instance, name, el, funcName, params);
    }
  }
}
function setListener(
  instance: any,
  event: string,
  target: HTMLElement,
  funName: string,
  params: string[]
) {
  target.addEventListener(event, (e) => {
    if (!instance[funName]) {
      console.error('Function: ', funName, 'notfound');
      return;
    }
    if (params.length == 0 || (params.length == 1 && params[0] == '')) {
      instance[funName].bind(instance)();
      return;
    }
    const isBetweenQuotes = (str: string) => /^(['"])(.*)\1$/.test(str);

    const processedParams = params.map((value) => {
      if (isBetweenQuotes(value))
        return value.length <= 2 ? '' : value.slice(1, -1);
      if (value == '$event') return e;
      return Number(value);
    });
    instance[funName].bind(instance)(...processedParams);
  });
}
