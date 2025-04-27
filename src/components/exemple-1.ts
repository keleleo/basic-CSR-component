import { ComponentDef } from '../core/@types/componentDef';
import { Observable } from '../core/class/Observable';

const html = /* html */ `
<h1>{{header}}</h1>
{{item.id}} -- {{item.name}}
`;

class TextBind {
  header = new Observable('Teste: Text Bind!');
  item = new Observable({
    id: 1,
    name: 'Batata',
    info: {
      createAt: new Date(),
      keys: [{ name: 'food', key: 'FOOD' }],
    },
  });

  constructor() {
    setInterval(() => {
      this.item.change((prev) => ({ ...prev, id: Date.now() }));
    }, 250);
  }
}

export const exemple1: ComponentDef<TextBind> = {
  html,
  clazz: TextBind,
  name: 'ex-text-bind',
};
