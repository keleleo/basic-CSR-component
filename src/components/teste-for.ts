const html =
  /* html */
  `
  {{index}}
  <button click='add'>add</button><button click='pop'>pop</button>
  <input [(value)]='index' /><button click='removeIndex'>remove Index</button>
  <button click='updateIndex'>update Index</button>
  <br>
  <!---
  <pre>
,{{list}}
  </pre> --->
  <br>
  <teste-for-item *for="list" *key='$item.id'></teste-for-item>
`;
class Component {
  index = 0;
  list = [
    {
      id: 1,
      cliente: 'João Silva',
      itens: [
        { id: 101, produto: 'Camisa', quantidade: 2, preco: 49.9 },
        { id: 102, produto: 'Calça', quantidade: 1, preco: 89.9 },
      ],
      status: 'Em andamento',
    },
    {
      id: 2,
      cliente: 'Maria Oliveira',
      itens: [
        { id: 201, produto: 'Vestido', quantidade: 1, preco: 129.9 },
        { id: 202, produto: 'Sandália', quantidade: 2, preco: 59.9 },
      ],
      status: 'Concluído',
    },
    {
      id: 3,
      cliente: 'Carlos Souza',
      itens: [{ id: 301, produto: 'Tênis', quantidade: 1, preco: 199.9 }],
      status: 'Cancelado',
    },
  ];

  constructor() {}

  onChangeValue(attr: string, value: any) {
    console.log('onChangeValue:', attr);
  }

  add() {
    this.list.push({
      id: Date.now(),
      cliente: 'Carlos Souza',
      itens: [{ id: 301, produto: 'Tênis', quantidade: 1, preco: 199.9 }],
      status: 'Cancelado',
    });
  }
  pop() {
    this.list.pop();
  }

  removeIndex() {
    this.list.splice(this.index, 1);
  }
  updateIndex() {
    const newlist = Array.from(this.list);
    newlist[this.index].cliente += '';
  }
}
export const testeFor = { html, component: Component, tag: 'teste-for' };

const htmlItem =
  /* html */
  `
  <div style='background:#eee; width:250px;margin:10px;padding:5px;'>
    id:{{$item.id}}
    <br>
    Nome:{{$item.cliente}}
  </div>

`;
class ComponentItem {
  $item: any = null as any;
  prods = this.$item;
  onChangeValue(attr: string, value: any) {
    console.log(this.prods);
  }
}
export const testeForItem = {
  html: htmlItem,
  component: ComponentItem,
  tag: 'teste-for-item',
};

const htmlProd =
  /* html */
  `
 {{value}}
 {{$item.itens.0.produto}}
`;
class ComponentProd {
  value: string = '..';
  $item: any = null as any;
  onChangeValue(attr: string, value: any) {}
}
export const testeForProd = {
  html: htmlProd,
  component: ComponentProd,
  tag: 'teste-for-prod',
};
