import { BindType } from '../../@types/bindType';
import {
  HtmlAttr,
  HtmlForPropertyData,
  HtmlObject,
} from '../../@types/htmlObject';
import { ObjectPath } from '../../class/objectPath';
import { getMethodValue } from './methodValue';

type attNameValue = {
  name: string;
  value: string;
};

export class ParseUtils {
  static elementOf(tag: string, attsNameValue: attNameValue[]): HtmlObject {
    const atts: HtmlAttr[] = this.toHtmlAtt(attsNameValue);
    const forAtt = atts.find((att) => att.bindType === BindType.FOR);
    let forData;
    if (forAtt) {
      const index = atts.indexOf(forAtt);
      atts.splice(index, 1);
      forData = this.getForData(forAtt);
    }

    return {
      attr: atts,
      children: [],
      forPropertyData: forData,
      isCustom: tag.includes('-'),
      tag: tag,
      type: 'Element',
    };
  }

  static getForData(att: HtmlAttr): HtmlForPropertyData | undefined {
    if (att.bindType !== BindType.FOR) return;
    const str = att.value;
    const semicolonSplit = str.split(';');
    const [varDef, indexDef] = semicolonSplit;
    const ofSplit = varDef.split(' of ');
    if (semicolonSplit.length > 2) tooManySemicolonsErr(str);
    if (ofSplit.length < 2) missingOF(varDef);
    if (ofSplit.length > 2) tooManyOF(varDef);
    const [varName, data] = ofSplit;

    //TODO: imp Index parser
    return {
      name: varName.trim(),
      valueWithContext: getMethodValue(data),
    };
  }

  static toHtmlAtt(atts: attNameValue[]): HtmlAttr[] {
    return atts.map(({ name, value }) => {
      let bindType = this.getBindType(name, value);
      const newName = this.getAttInsideBind(name, bindType);
      const isProperty = this.isProperty(value);
      const path = isProperty ? new ObjectPath(value) : undefined;

      if (bindType === BindType.TWOWAY && !isProperty) {
        onlyPropertyForTwoway(name, value);
      }

      // if (bindType === BindType.OUTPUT && isProperty) {
      //   if (path && path.deep > 1) inputNestedPropertiesErr(name, value);
      // }

      // if (bindType === BindType.TWOWAY) {
      //   if (path && path.deep > 1) twowayNestedPropertiesErr(name, value);
      // }

      const methodValue =
        bindType !== BindType.FOR && bindType !== BindType.NOBIND && !isProperty
          ? getMethodValue(value || 'true')
          : undefined;

      return {
        name: newName,
        value: value || 'true',
        bindType: bindType,
        methodValue: methodValue,
        path,
      } as HtmlAttr;
    });
  }

  static attValueToPath(value: string): ObjectPath {
    const pIndex = value.indexOf('(');
    return new ObjectPath(pIndex !== -1 ? value.slice(0, pIndex) : value);
  }

  static getAttInsideBind(str: string, bind: BindType) {
    if (bind === BindType.NOBIND || bind === BindType.FOR) return str;
    const q = bind === BindType.TWOWAY ? 2 : 1;
    return str.slice(q, -q);
  }

  static getBindType(name: string, value: string): BindType {
    if (this.isTWOWAY(name)) return BindType.TWOWAY;
    if (this.isOUTPUT(name)) return BindType.OUTPUT;
    if (this.isINPUT(name)) return BindType.INPUT;
    if (this.isFOR(name)) return BindType.FOR;
    return BindType.NOBIND;
  }

  static isTWOWAY(name: string) {
    const left = name.startsWith('[(');
    const right = name.endsWith(')]');
    if (left !== right) throw new Error('Incorrect attribute declaration');

    return left;
  }

  static isOUTPUT(name: string) {
    const left = name.startsWith('(');
    const right = name.endsWith(')');
    if (left !== right) throw new Error('Incorrect attribute declaration');
    return left;
  }

  static isINPUT(name: string) {
    const left = name.startsWith('[');
    const right = name.endsWith(']');
    if (left !== right) throw new Error('Incorrect attribute declaration');
    return left;
  }

  static isFOR(name: string) {
    return name.startsWith('*for');
  }

  static isProperty(str: string): boolean {
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str)) true;
    const splited = str.split('.');

    for (const t of splited) {
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(t)) return false;
    }
    return true;
  }
}

function inputNestedPropertiesErr(name: string, value: string) {
  throw new Error(
    `Input binding does not support nested property access. Attribute: "${name}" with value "${value}".`
  );
}

function twowayNestedPropertiesErr(name: string, value: string) {
  throw new Error(
    `Two-way binding does not support nested property access. Attribute: "${name}" with value "${value}".`
  );
}

function onlyPropertyForTwoway(name: string, value: string) {
  throw new Error(
    `Invalid binding detected: only properties are allowed for [(two-way)] bindings. Received attribute "${name}" with value "${value}".`
  );
}

function tooManySemicolonsErr(str: string) {
  throw new Error(
    `Invalid syntax in *for binding: too many semicolons in "${str}". Expected at most one semicolon for optional index variable.`
  );
}

function missingOF(varDef: string) {
  throw new Error(
    `Invalid *for syntax: missing 'of' in "${varDef}". Expected format: "item of items".`
  );
}

function tooManyOF(varDef: string) {
  throw new Error(
    `Invalid *for syntax: too many 'of' keywords in "${varDef}". Only one 'of' is allowed.`
  );
}
