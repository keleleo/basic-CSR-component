const html = /* html */ `
{{value_select}} <br>
{{value_input}} <br>
{{value_textarea}} <br>

<select [(value)]='value_select' >
  <option value="valor1">Valor 1</option>
  <option value="valor2">Valor 2</option>
  <option value="valor3">Valor 3</option>
</select>
<br>
<input [value]='value_input'>
<br>
<textarea (value)='value_textarea'></textarea>
`;

class Component {
  value_select = 'valor2';
  value_input = 'input initial value';
  value_textarea = 'textarea value';
  constructor() {
    setInterval(() => {}, 1500);
  }
}
export const testeProp = {
  html: html,
  component: Component,
  tag: 'teste-prop',
};
