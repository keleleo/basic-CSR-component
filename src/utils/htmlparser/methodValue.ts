import {
  AnyNode,
  Identifier,
  parseExpressionAt,
  PrivateIdentifier,
} from 'acorn';
import { HtmlMethod } from '../../@types/htmlObject';

export function getFunctionFromAtt(rawValue: string) {
  return (context: any) =>
    new Function(`with(this) return ${rawValue}`).call(context);
}

function walk(
  exp: AnyNode | null | undefined,
  prop: { identifiers: (Identifier | PrivateIdentifier)[] }
) {
  if (!exp || typeof exp !== 'object' || !('type' in exp)) return;
  if (exp.type === 'Literal') return;
  if (exp.type === 'Identifier' || exp.type === 'PrivateIdentifier') {
    prop.identifiers.push(exp);
    return;
  }

  if (exp.type === 'ClassExpression') {
    throw new Error('Class Expression');
  }
  if (exp.type === 'AwaitExpression') {
    throw new Error('Await Expression');
  }
  if (exp.type === 'ImportExpression') {
    throw new Error('Import Expression');
  }
  if (exp.type === 'BlockStatement') {
    throw new Error('BlockStatement');
  }

  if (exp.type === 'BinaryExpression') {
    walk(exp.left, prop);
    walk(exp.right, prop);
    return;
  }
  if (exp.type === 'ThisExpression') {
    return;
  }
  if (exp.type === 'ArrayExpression') {
    exp.elements.forEach((el) => walk(el, prop));
    return;
  }
  if (exp.type === 'ObjectExpression') {
    exp.properties.forEach((p) => walk(p, prop));
    return;
  }
  if (exp.type === 'FunctionExpression') {
    exp.body.body.forEach((el) => walk(el, prop));
    return;
  }
  if (exp.type === 'UnaryExpression') {
    walk(exp.argument, prop);
    return;
  }
  if (exp.type === 'UpdateExpression') {
    walk(exp.argument, prop);
    return;
  }
  if (exp.type === 'AssignmentExpression') {
    walk(exp.left, prop);
    walk(exp.right, prop);
    return;
  }
  if (exp.type === 'LogicalExpression') {
    walk(exp.left, prop);
    walk(exp.right, prop);
    return;
  }
  if (exp.type === 'MemberExpression') {
    walk(exp.object, prop);
    return;
  }
  if (exp.type === 'ConditionalExpression') {
    walk(exp.test, prop);
    walk(exp.alternate, prop);
    walk(exp.consequent, prop);
    return;
  }
  if (exp.type === 'CallExpression') {
    exp.arguments.forEach((p) => walk(p, prop));
    return;
  }
  if (exp.type === 'NewExpression') {
    exp.arguments.forEach((p) => walk(p, prop));
    return;
  }
  if (exp.type === 'SequenceExpression') {
    exp.expressions.forEach((p) => walk(p, prop));
    return;
  }
  if (exp.type === 'ArrowFunctionExpression') {
    walk(exp.body, prop);
    return;
  }
  if (exp.type === 'YieldExpression') {
    walk(exp.argument, prop);
    return;
  }
  if (exp.type === 'TaggedTemplateExpression') {
    walk(exp.tag, prop);
    walk(exp.quasi, prop);
    return;
  }
  // if (exp.type === 'MetaProperty') {}
  if (exp.type === 'ChainExpression') {
    walk(exp.expression, prop);
    return;
  }
  if (exp.type === 'ParenthesizedExpression') {
    walk(exp.expression, prop);
    return;
  }
  if (exp.type === 'Property') {
    walk(exp.key, prop);
    walk(exp.value, prop);
    return;
  }
  if (exp.type === 'SpreadElement') {
    walk(exp.argument, prop);
    return;
  }
  if (exp.type === 'TemplateLiteral') {
    exp.quasis.forEach((el) => walk(el, prop));
    exp.expressions.forEach((el) => walk(el, prop));
    return;
  }
}

export function getProperties(str: string) {
  const ast = parseExpressionAt(str, 0, {
    ecmaVersion: 2020,
  });
  const prop: {
    identifiers: (Identifier | PrivateIdentifier)[];
  } = { identifiers: [] };
  walk(ast, prop);
  return prop;
}

export function getMethodValue(str: string): HtmlMethod {
  const props = getProperties(str);

  return {
    execute: getFunctionFromAtt(str),
    properties: props.identifiers.map((m) => m.name),
  };
}
