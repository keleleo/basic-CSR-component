import { BindInfo } from '../../../@types/bindInfo';
import { TextBind } from '../../../@types/Component/elementBindData';
import { ComponentBase } from '../ComponentBase';

export function bindText(
  root: ComponentBase,
  instance: any,
  textBinds: TextBind[]
): BindInfo {
  const bindInfo: BindInfo = {
    stopListener: [],
  };

  for (const bind of textBinds) {
    const fn = () => {
      const value: any = bind.method.execute(instance);
      bind.text.textContent = value.toString();
    };
    const stopListener = root.listenProperties(fn, ...bind.method.properties);
    bindInfo.stopListener.push(stopListener);
    fn();
  }

  return bindInfo;
}
