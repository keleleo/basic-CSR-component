import { BindType } from '../@types/bindType';
import { HtmlAttr, HtmlObject, HtmlTextObject } from '../@types/htmlObject';
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
export function htmlParser(html: string) {
  html = '<root>' + html.trim() + '</root>';

  const { el, p } = parseEl(html, 0);
  return el;
}
function parseAtt(rawAttrs: string) {
  const attrs: HtmlAttr[] = [];
  let match;
  const attrRegex = /([^\s=]+)(?:=['"]([^'"]*)['"])?/g;
  while ((match = attrRegex.exec(rawAttrs)) !== null) {
    const [_, name, value] = match;
    attrs.push(generateAttObj(name, value));
  }
  return attrs;
}
function generateAttObj(name: string, value: string): HtmlAttr {
  let bindType = getBindType(name);
  const newName =
    bindType == undefined ? name : getAttInsideBind(name, bindType);
  if (
    (bindType == BindType.INPUT || bindType == BindType.TWOWAY) &&
    value.includes('.')
  ) {
    bindType = undefined;
    console.error(`Input attribute ${name} does not suport a path ${value}`);
  }

  return { name: newName, value: value || '', bindType: bindType };
}
function parseEl(html: string, pos: number) {
  const tagOpenRegex = /^<([\w-]+)([^>]*)>/;
  const tagOpen = tagOpenRegex.exec(html.slice(pos));
  if (!tagOpen) throw new Error(`Invalid tagOpen ${pos}`);

  const [elInfo, tag, rawAttrs] = tagOpen;
  const isSelfClose = elInfo.endsWith('/>') || voidTags.has(tag);
  const element = getElement(tag, rawAttrs);
  const closeTag = `</${tag}>`;

  pos += elInfo.length;

  while (!isSelfClose && pos < html.length) {
    if (html.startsWith(closeTag, pos)) {
      pos += closeTag.length;
      break;
    } else if (html.startsWith('<!--', pos)) {
      const closePos = html.indexOf('-->', pos);
      pos = closePos == -1 ? html.length : closePos + 3;
    } else if (html[pos] === '<') {
      const { el, p: nPos } = parseEl(html, pos);
      element.children.push(el);
      pos = nPos;
    } else {
      const textEnd = html.indexOf('<', pos);
      const txtLength = textEnd === -1 ? html.length : textEnd;
      const text = html.slice(pos, txtLength).trim();
      if (text) {
        const txtElements = getTextElements(text);
        element.children.push(...txtElements);
      }

      pos = txtLength;
    }
  }

  return { el: element, p: pos };
}
function getElement(tag: string, rawAttrs: string): HtmlObject {
  return {
    type: 'Element',
    tag: tag,
    attr: parseAtt(rawAttrs),
    isCustom: tag.includes('-'),
    children: [],
  };
}
function getTextElements(str: string): HtmlTextObject[] {
  const regex_attr_piece = /[^{}]+|\{\{[a-zA-Z0-9_$.]+\}\}/g;
  return (str.match(regex_attr_piece) || []).map((text) => {
    let bind =
      text.startsWith('{{') && text.endsWith('}}')
        ? text.slice(2, -2)
        : undefined;

    return {
      type: 'Text',
      text: text,
      bind,
    };
  });
}

function getAttInsideBind(str: string, bind: BindType) {
  const q = bind == BindType.TWOWAY ? 2 : 1;
  return str.slice(q, -q);
}

function getBindType(name: string): BindType | undefined {
  if (name.startsWith('[(') && name.endsWith(')]')) return BindType.TWOWAY;
  if (name.startsWith('[') && name.endsWith(']')) return BindType.OUTPUT;
  if (name.startsWith('(') && name.endsWith(')')) return BindType.INPUT;
  return undefined;
}
