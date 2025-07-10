import { BindType } from '../../src/@types/bindType';
import { HtmlObject } from '../../src/@types/htmlObject';
import { HtmlParser } from '../../src/utils/htmlparser/htmlParser';
test('Parse static att', () => {
  const html = /* html */ `
    <button class='btn-small'>Button Text</button>
    `;
  const parsed = HtmlParser.parse(html);
  const target: HtmlObject = {
    attr: [],
    children: [
      {
        attr: [
          { name: 'class', value: 'btn-small', bindType: BindType.NOBIND },
        ],
        children: [{ type: 'Text', text: 'Button Text' }],
        isCustom: false,
        forPropertyData: undefined,
        type: 'Element',
        tag: 'button',
      },
    ],
    isCustom: false,
    forPropertyData: undefined,
    tag: 'root',
    type: 'Element',
  };
  expect(parsed).toEqual(target);
});
