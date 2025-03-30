const prefix = 'set';
export function attrBind(el: Element, setListener: any) {
  const els = getElementsToBind(el);

  els.forEach((e) => bind(e, setListener));
}

function bind(el: Element, setListener: any) {
  const attrs = Array.from(el.attributes)
    .map((a) => a.name)
    .filter((a) => a.startsWith(prefix));
  for (const attr of attrs) {
    const varName = attr.replace(new RegExp('^' + prefix), '');
    const value = el.getAttribute(attr) || '';
    const funName = prefix + upperFistChar(varName);
    const elIsntance = (el as any).instance;
    if (!elIsntance || !elIsntance[funName])
      throw new Error(funName + ' notfound');
    const setFun = elIsntance[funName].bind(elIsntance);
    const hasCurly =
      (value || '').startsWith('{') && (value || '').endsWith('}');

    if (!hasCurly) {
      setFun(value);
      return;
    }

    setListener(value.slice(1, -1), setFun);
  }
}
function upperFistChar(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function getElementsToBind(el: Element) {
  return Array.from(el.querySelectorAll('*')).filter((e) =>
    Array.from(e.attributes).some((attr) => attr.name.startsWith(prefix))
  );
}
