const htmlContainer =
  /* html */
  `
  {{text}}
  <teste-content (run)='newRun'></teste-content>
`;
class TestContainer {
  text = 'Loading';
  newRun = () => {
    this.text += '.';
    console.log('TestContainer', this.text);
  };
}
export const testContainer = {
  html: htmlContainer,
  component: TestContainer,
  tag: 'teste-container',
};

const htmlContent =
  /* html */
  `
  <button click='run()'>click</button>
`;
class TestContent {
  text = 'temp';
  run = () => {
    console.log('TestContent');
  };

  onChangeValue(attr: string, v: any) {
    console.log(attr, v);
  }
}
export const testContent = {
  html: htmlContent,
  component: TestContent,
  tag: 'teste-content',
};
