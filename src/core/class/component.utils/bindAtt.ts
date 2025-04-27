import { BindType } from '../../@types/bindType';
import { HtmlAttr } from '../../@types/htmlObject';
import { attFromPathAtt } from '../../utils/attFromPathAtt';
import { objValueByPath } from '../../utils/objValueByPath';
import { pathWithoutRootAtt } from '../../utils/pathWithoutRootAtt';
import { ComponentBase } from '../ComponentBase';

export function bindAtts(
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
  if (att.bindType == BindType.INPUT || att.bindType == BindType.TWOWAY)
    otherObservable.bind(localObservable);
  if (att.bindType == BindType.OUTPUT || att.bindType == BindType.TWOWAY)
    localObservable.listen((value, oldValue, code) => {
      const nValue = objValueByPath(pathWithoutRoot, value);
      otherObservable.set(nValue, code);
    });
}
