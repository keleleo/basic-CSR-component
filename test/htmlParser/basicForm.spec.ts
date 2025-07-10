import { BindType } from '../../src/@types/bindType';
import { HtmlObject } from '../../src/@types/htmlObject';
import { ObjectPath } from '../../src/class/objectPath';
import { HtmlParser } from '../../src/utils/htmlparser/htmlParser';
test('Parse INPUT att', () => {
  const html = /* html */ `
    <div class='form'>
      <input [(value)]='email' placeholder='Email'/>
      <input [(value)]='password' placeholder='Password'/>
      <button class='btn-small'>Login</button>
    </div>
    `;
  const parsed = HtmlParser.parse(html);
  const target: HtmlObject = {
    attr: [],
    children: [
      {
        attr: [
          {
            name: 'class',
            value: 'form',
            bindType: BindType.NOBIND,
            path: undefined,
          },
        ],
        children: [
          {
            attr: [
              {
                name: 'value',
                value: 'email',
                bindType: BindType.TWOWAY,
                path: new ObjectPath('email'),
              },
              {
                name: 'placeholder',
                value: 'Email',
                bindType: BindType.NOBIND,
                path: undefined,
              },
            ],
            children: [],
            isCustom: false,
            forPropertyData: undefined,
            type: 'Element',
            tag: 'input',
          },
          {
            attr: [
              {
                name: 'value',
                value: 'password',
                bindType: BindType.TWOWAY,
                path: new ObjectPath('password'),
              },
              {
                name: 'placeholder',
                value: 'Password',
                bindType: BindType.NOBIND,
                path: undefined,
              },
            ],
            children: [],
            isCustom: false,
            forPropertyData: undefined,
            type: 'Element',
            tag: 'input',
          },
          {
            attr: [
              {
                name: 'class',
                value: 'btn-small',
                bindType: BindType.NOBIND,
                path: undefined,
              },
            ],
            children: [{ type: 'Text', text: 'Login', bind: undefined }],
            isCustom: false,
            forPropertyData: undefined,
            type: 'Element',
            tag: 'button',
          },
        ],
        isCustom: false,
        forPropertyData: undefined,
        type: 'Element',
        tag: 'div',
      },
    ],
    isCustom: false,
    forPropertyData: undefined,
    tag: 'root',
    type: 'Element',
  };
  expect(parsed).toEqual(target);
});
