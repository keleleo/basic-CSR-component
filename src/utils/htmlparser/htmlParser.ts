import { HtmlObject, HtmlTextObject } from '../../@types/htmlObject';
import { getMethodValue } from './methodValue';
import { ParseUtils } from './parseUtils';

export class HtmlParser {
  static parse(htmlString: string): HtmlObject {
    htmlString = `<root>${htmlString}</root>`;
    const { element } = this.parseElement(htmlString, 0);
    return element;
  }

  private static parseElement(str: string, pos: number) {
    const { tag, endPos: tagPos } = this.getOpenTag(str, pos);
    const { atts, endPos: attPos } = this.getAtt(str, tagPos);
    const selfClose = str.endsWith('/>', attPos + 2) || voidTags.has(tag);
    const closeTag = `</${tag}>`;
    pos = attPos;
    pos += selfClose ? 2 : 1;

    const element = ParseUtils.elementOf(tag, atts);

    while (!selfClose && pos < str.length) {
      if (str.startsWith(closeTag, pos)) {
        pos += closeTag.length;
        break;
      } else if (str.startsWith('<!--', pos)) {
        const closePos = str.indexOf('-->', pos);
        pos = closePos === -1 ? str.length : closePos + 3;
      } else if (str.charAt(pos) === '<') {
        const { element: el, pos: endPos } = this.parseElement(str, pos);
        element.children.push(el);
        pos = endPos;
      } else {
        const textEnd = str.indexOf('<', pos);
        const txtLength = textEnd === -1 ? str.length : textEnd;
        const text = str.slice(pos, txtLength).trim();
        if (text) {
          const txtElements = this.getTextElements(text);
          element.children.push(...txtElements);
        }

        pos = txtLength;
      }
    }

    return { element, pos };
  }

  private static getTextElements(str: string): HtmlTextObject[] {
    // const regex_attr_piece = /[^{}]+|\{\{[a-zA-Z0-9_$.]+\}\}/g;
    const regex_attr_piece = /[^{}]+|\{\{(.*?)\}\}/g;

    return (str.match(regex_attr_piece) || []).map((text) => {
      let method;

      method =
        text.startsWith('{{') && text.endsWith('}}')
          ? getMethodValue(text.slice(2, -2))
          : undefined;

      return {
        type: 'Text',
        text,
        method: method,
      } as HtmlTextObject;
    });
  }

  private static getAtt(str: string, pos: number) {
    // const maxTry = 1000;
    // let t = 0;

    let itemIndex = 1;
    let nameStep = true;
    let findName = true;
    let quote = '';

    const atts: { name: string; value: string }[] = [];
    while (true) {
      // t++;
      // if (t >= maxTry) break;

      const char = str.charAt(pos);
      pos++;
      if (nameStep && quote === '' && (char === '/' || char === '>')) break;
      if (!nameStep && quote === '') {
        if (char === '"' || char === "'") quote = char;
        continue;
      }

      if (!nameStep && char === quote) {
        nameStep = true;
        findName = true;
        quote = '';
        itemIndex++;
        continue;
      }

      if (nameStep && char === '=') {
        nameStep = false;
        continue;
      }

      if (nameStep && char === ' ') {
        if (str.charAt(pos) !== '=' && !findName) {
          itemIndex++;
        }
        continue;
      }

      if (atts.length < itemIndex) {
        atts.push({ name: '', value: '' });
      }

      const item = atts[itemIndex - 1];
      if (nameStep) {
        item.name += char;
        findName = false;
      } else item.value += char;
    }
    return { atts, endPos: pos - 1 };
  }

  private static getOpenTag(str: string, pos: number) {
    const maxTry = 1000;
    let t = 0;

    let tag = '';
    let inTag;
    while (true) {
      t++;
      if (t >= maxTry) break;

      const char = str.charAt(pos);
      pos++;
      if (!inTag) {
        inTag = char === '<';
        continue;
      }
      if (char === ' ' || char === '/' || char === '>') {
        break;
      }
      tag += char;
    }
    return { tag, endPos: pos - 1 };
  }
}

const voidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
]);
