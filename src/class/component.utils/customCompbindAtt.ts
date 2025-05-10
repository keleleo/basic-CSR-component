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
  atts.forEach((att) => bindAtt(root, el, att));
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
  if (att.bindType == BindType.INPUT || att.bindType == BindType.TWOWAY)
    otherObservable.bind(localObservable);
  if (att.bindType == BindType.OUTPUT || att.bindType == BindType.TWOWAY)
    localObservable.listen((value: any, oldValue: any, code: string) => {
      const nValue = objValueByPath(pathWithoutRoot, value);
      otherObservable.set(nValue, code);
    });
}
