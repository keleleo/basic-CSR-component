import { HtmlObject } from '../../src/@types/htmlObject';
import { ObjectPath } from '../../src/class/objectPath';
import { HtmlParser } from '../../src/utils/htmlparser/htmlParser';
test('Parse text bind', () => {
  const html = /* html */ `
    <span>Hello: {{name}}</span>
    `;
  const parsed = HtmlParser.parse(html);
  const target: HtmlObject = {
    attr: [],
    children: [
      {
        attr: [],
        children: [
          { type: 'Text', text: 'Hello: ' },
          { type: 'Text', text: '{{name}}', bind: new ObjectPath('name') },
        ],
        isCustom: false,
        forPropertyData: undefined,
        type: 'Element',
        tag: 'span',
      },
    ],
    isCustom: false,
    forPropertyData: undefined,
    tag: 'root',
    type: 'Element',
  };
  expect(parsed).toEqual(target);
});
