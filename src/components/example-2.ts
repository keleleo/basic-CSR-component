import { ComponentDef } from '../core/@types/componentDef';
import { Observable } from '../core/class/Observable';

const ex2Children = /* html */ `
  <div>Children ------------------ </div>
  <div>value: {{value}}</div>
  <div>time: {{time}}</div>
  <div>text: {{text}}</div>
  <div>user: {{userName}}</div>
`;
class Ex2Children {
  value = new Observable(0);
  time = new Observable(Date.now());
  text = new Observable('');
  userName = new Observable('');

  obsBatata = new Observable('Initial value');

  constructor() {
    this.obsBatata.listen((value, oldvalue) => {
      console.log('obsBatata: ', value);
    });

    setInterval(() => this.time.set(Date.now()), 100);
    setInterval(() => {
      this.text.set('ab');
    }, 1000);
  }
}

const ex2ContainerStyle = /* css */ `
root {
  background:pink;
  display:block;
  padding:10px;
  border-radius:5px;
  overflow:hidden;
  width:fit-content
}

ex-att-bind-children{
  margin-top:10px;
  display:block;
  background:#eee;
  width:200px;
  padding:5px;
}
`;
const ex2Container = /* html */ `
  <h1>Teste: Att bind</h1>
  <div>Parent</div>
  <div>value: {{c_value}}</div>
  <div>time: {{c_time}}</div>
  <div>text: {{c_text}}</div>
  <div>id: {{c_user.id}}</div>
  <div>user: {{c_user.name}}</div>
  
  <ex-att-bind-children [value]='c_value' (time)='c_time' [(text)]='c_text' [userName]='c_user.name' />
`;
class Ex2Container {
  c_value = new Observable(Math.random());
  c_time = new Observable(0);
  c_text = new Observable('a');
  c_user = new Observable({ id: 1, name: 'keleleo' });

  constructor() {
    setInterval(() => this.c_value.set(Math.random()), 100);
    setInterval(() => this.c_text.set('a'), 500);

    setInterval(
      () =>
        this.c_user.change((prev) => ({
          ...prev,
          name: prev.name == 'keleleo' ? 'batata' : 'keleleo',
        })),
      500
    );
  }
}

export const exemple2_1: ComponentDef<Ex2Container> = {
  html: ex2Container,
  clazz: Ex2Container,
  name: 'ex-att-bind',
  css: ex2ContainerStyle,
};
export const exemple2_2: ComponentDef<Ex2Children> = {
  html: ex2Children,
  clazz: Ex2Children,
  name: 'ex-att-bind-children',
};
