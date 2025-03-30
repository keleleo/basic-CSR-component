const htmlCard =
  /* html */
  `
  <teste-title setTitle='Titlo 1' disable></teste-title>
  <br>
  <teste-title setTitle='{cardTitle}'></teste-title>
`;
class Card {
  cardTitle = '';
  constructor() {
    const t = 'Card titulo';
    let i = 0;
    setInterval(() => {
      this.cardTitle += t.charAt(i);
      i++;
      if (i >= t.length) {
        this.cardTitle = '';
        i = 0;
      }
    }, 200);
  }
}
export const testeCard = { html: htmlCard, component: Card, tag: 'teste-card' };

const htmlTitle =
  /* html */
  `
  <div>batata</div>
  Title: {{title}}
`;
class Title {
  title = '';

  setTitle(value: string) {
    this.title = value;
  }
}
export const testeTitle = {
  html: htmlTitle,
  component: Title,
  tag: 'teste-title',
};
