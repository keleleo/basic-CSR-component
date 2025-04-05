const htmlCard =
  /* html */
  `
  <teste-title (title)='cardTitle'></teste-title>
  <br>
  <teste-input [(value)]='cardTitle'></teste-input>
`;
class Card {
  cardTitle = 'Card titulo';
  onChangeValue(attr: string, value: any) {}
}
export const testeCard = { html: htmlCard, component: Card, tag: 'teste-card' };

const htmlTitle =
  /* html */
  `
  Title: {{title}}
`;
class Title {
  title = 'default-title';

  onChangeValue(attr: string, value: any) {}
}
export const testeTitle = {
  html: htmlTitle,
  component: Title,
  tag: 'teste-title',
};

const htmlInput =
  /* html */
  `
  <div>input value:
  <input [(value)]='value'>
  </div>
`;
class TestInput {
  value = '';

  onChangeValue(attr: string, value: any) {
    console.table({ component: 'TestInput', attr, value });
  }
}
export const testeInput = {
  html: htmlInput,
  component: TestInput,
  tag: 'teste-input',
};
