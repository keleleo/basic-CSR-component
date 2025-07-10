import { BindInfo } from '../../../@types/bindInfo';
import { AttributeBinds } from '../../../@types/Component/elementBindData';
import { ComponentBase } from '../ComponentBase';
import { customCompBindManager } from './bindComponent/customCompBindManager';
import { nativeCompBindManager } from './bindComponent/nativeCompBindManager';

export function bindAtt(
  root: ComponentBase,
  instance: any,
  { atts, el, isCustom }: AttributeBinds
): BindInfo {
  if (isCustom) {
    if (!(el instanceof ComponentBase))
      root.elementErro(
        `Element <${el.tagName.toLowerCase()}> was marked as a custom component,` +
          `but it is not an instance of ComponentBase. `
      );
    return customCompBindManager(root, instance, el, atts);
  } else {
    return nativeCompBindManager(root, instance, el, atts);
  }
}
