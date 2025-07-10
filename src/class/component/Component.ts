import { ElementsBinds } from '../../@types/Component/elementBindData';
import { HtmlObject } from '../../@types/htmlObject';
import { bindAtt } from './bind/bindAtt';
import { bindText } from './bind/bindText';
import { ForController } from './bind/forController';
import { ComponentBase } from './ComponentBase';
import { GenerateElement } from './generateElements';

export class Component<T extends Object> extends ComponentBase<T> {
  forController: ForController;

  constructor(componentName: string, instance: T) {
    super(componentName, instance);
    this.forController = new ForController(this);
  }

  init(htmlObject: HtmlObject) {
    const bindsData: ElementsBinds[] = this.generateRootChrildren(htmlObject);
    this.initializeBindings(bindsData);
  }

  private initializeBindings(bindsData: ElementsBinds[]) {
    for (const bindData of bindsData) {
      for (const elBind of bindData.elementsToBind) {
        bindAtt(this, this.instance, elBind);
      }
      bindText(this, this.instance, bindData.textBinds);

      // bindData.forBind.forEach(({ target, data }) => {
      // this.forController.addForElement(target, data);
      // });
    }
  }

  private generateRootChrildren(htmlObject: HtmlObject) {
    const bindsData: ElementsBinds[] = [];
    htmlObject.children.forEach((htmlObject) => {
      const { element, binds } = GenerateElement.generate(htmlObject);
      bindsData.push(binds);
      this.appendChild(element);
    });
    return bindsData;
  }
}
