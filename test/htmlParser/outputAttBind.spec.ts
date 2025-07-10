import { BindType } from '../../src/@types/bindType';
import { HtmlObject } from '../../src/@types/htmlObject';
import { ObjectPath } from '../../src/class/objectPath';
import { HtmlParser } from '../../src/utils/htmlparser/htmlParser';
test('Parse OUTPUT att', () => {
  const html = /* html */ `
    <input [value]='val'/>
    `;
  const parsed = HtmlParser.parse(html);
  const target: HtmlObject = {
    attr: [],
    children: [
      {
        attr: [
          {
            name: 'value',
            value: 'val',
            bindType: BindType.OUTPUT,
            path: new ObjectPath('value'),
          },
        ],
        children: [],
        isCustom: false,
        forPropertyData: undefined,
        type: 'Element',
        tag: 'input',
      },
    ],
    isCustom: false,
    forPropertyData: undefined,
    tag: 'root',
    type: 'Element',
  };
  expect(parsed).toEqual(target);
});
