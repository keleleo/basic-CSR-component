import { BindType } from '../../@types/bindType';
import { HtmlAttr } from '../../@types/htmlObject';
import { attFromPathAtt } from '../../utils/attFromPathAtt';
import { objValueByPath } from '../../utils/objValueByPath';
import { pathWithoutRootAtt } from '../../utils/pathWithoutRootAtt';
import { ComponentBase } from '../ComponentBase';
import { Observable } from '../Observable';

export function customCompBindAtts(
  root: ComponentBase,
  el: ComponentBase,
  atts: HtmlAttr[]
) {
  atts.forEach((att) => {
    if (!att.bindType) setStaticValue(root, el, att);
    else bindAtt(root, el, att);
  });
}
function setStaticValue(root: ComponentBase, el: ComponentBase, att: HtmlAttr) {
  const observable = el.getObservable(att.name);
  if (!(observable instanceof Observable)) return;
  const val = getStaticValue(att.value);
  observable.set(val);
}
function getStaticValue(val: string) {
  const num = Number(val);
  if (!Number.isNaN(num)) return num;
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
}

function bindAtt(root: ComponentBase, el: ComponentBase, att: HtmlAttr) {
  const localAttr = attFromPathAtt(att.value);
  const pathWithoutRoot = pathWithoutRootAtt(att.value);
  const localObservable = root.getObservable(localAttr);
  const otherObservable = el.getObservable(att.name);
  if (
    !(localObservable instanceof Observable) ||
    !(otherObservable instanceof Observable)
  )
    return;

  if (att.bindType == BindType.OUTPUT || att.bindType == BindType.TWOWAY)
    otherObservable.bind(localObservable);
  if (att.bindType == BindType.INPUT || att.bindType == BindType.TWOWAY)
    localObservable.listen((value: any, oldValue: any, code: string) => {
      const nValue = objValueByPath(pathWithoutRoot, value);
      otherObservable.set(nValue, code);
    });
}
