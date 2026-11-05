import { parse } from "@babel/parser";
import traverseDefault from "@babel/traverse";
import { collectContentImportAliases, elementName, literalAttribute } from "./primitive-compliance.js";
const traverseModule = traverseDefault;
const traverse = typeof traverseModule === "function" ? traverseModule : traverseModule.default;
const TEXT_IMPORT_NAME = "Text";
const COLLECTION_IMPORT_NAME = "Collection";
const RESOLVE_FN_NAME = "resolveContentValue";
const KEY_ATTRIBUTE = "k";
const MAX_COLLECTION_DEPTH = 8;
const MAX_SKIPPED_TEXT = 80;
function keyAttribute(node) {
  for (const attr of node.openingElement.attributes) {
    if (attr.type !== "JSXAttribute") continue;
    if (attr.name.type === "JSXIdentifier" && attr.name.name === KEY_ATTRIBUTE) return attr;
  }
  return void 0;
}
function itemKeyCall(node) {
  const callee = node.callee;
  if (callee.type !== "MemberExpression") return void 0;
  if (callee.property.type !== "Identifier" || callee.property.name !== KEY_ATTRIBUTE) return void 0;
  if (callee.object.type !== "Identifier") return void 0;
  const [arg] = node.arguments;
  if (arg === void 0 || arg.type !== "StringLiteral") return void 0;
  return { binding: callee.object.name, field: arg.value };
}
function bindsItemAs(collection, binding) {
  for (const child of collection.children) {
    if (child.type !== "JSXExpressionContainer") continue;
    const expr = child.expression;
    if (expr.type !== "ArrowFunctionExpression" && expr.type !== "FunctionExpression") continue;
    const [first] = expr.params;
    if (first !== void 0 && first.type === "Identifier" && first.name === binding) return true;
  }
  return false;
}
function scopeFor(path, binding, collectionNames, depth = 0) {
  if (depth >= MAX_COLLECTION_DEPTH) return void 0;
  let child = path;
  for (let current = path.parentPath; current !== null; child = current, current = current.parentPath) {
    if (current.node.type !== "JSXElement") continue;
    if (child.node.type === "JSXOpeningElement") continue;
    const element = current.node;
    const name = elementName(element);
    if (name === void 0 || !collectionNames.has(name)) continue;
    if (!bindsItemAs(element, binding)) continue;
    const attr = keyAttribute(element);
    if (attr === void 0) return void 0;
    const literal = literalAttribute(attr);
    if (literal !== void 0) return { root: literal, chain: [] };
    const value = attr.value;
    if (value === null || value === void 0 || value.type !== "JSXExpressionContainer") return void 0;
    const expr = value.expression;
    if (expr.type !== "CallExpression") return void 0;
    const nested = itemKeyCall(expr);
    if (nested === void 0) return void 0;
    const parent = scopeFor(current, nested.binding, collectionNames, depth + 1);
    if (parent === void 0) return void 0;
    return { root: parent.root, chain: [...parent.chain, nested.field] };
  }
  return void 0;
}
function keyUseForCall(path, textNames, collectionNames) {
  for (let current = path.parentPath; current !== null; current = current.parentPath) {
    if (current.node.type === "JSXElement") return "resolve";
    if (current.node.type !== "JSXAttribute") continue;
    const attr = current.node;
    if (attr.name.type !== "JSXIdentifier" || attr.name.name !== KEY_ATTRIBUTE) return "resolve";
    const owner = current.parentPath;
    if (owner === null || owner.node.type !== "JSXOpeningElement") return "resolve";
    const name = owner.node.name;
    if (name.type !== "JSXIdentifier") return "resolve";
    if (textNames.has(name.name)) return "text";
    if (collectionNames.has(name.name)) return "collection";
    return "resolve";
  }
  return "resolve";
}
function sourceText(source, node) {
  const start = node.start;
  const end = node.end;
  if (start === null || start === void 0 || end === null || end === void 0) return "<expression>";
  return source.slice(start, end).replace(/\s+/g, " ").slice(0, MAX_SKIPPED_TEXT);
}
function collectAuthoredKeys(source) {
  let ast;
  try {
    ast = parse(source, { sourceType: "module", plugins: ["jsx"] });
  } catch (err) {
    return { keys: [], fields: [], skipped: [], parseError: String(err) };
  }
  const textNames = collectContentImportAliases(ast, TEXT_IMPORT_NAME);
  const collectionNames = collectContentImportAliases(ast, COLLECTION_IMPORT_NAME);
  const resolverNames = collectContentImportAliases(ast, RESOLVE_FN_NAME);
  const keys = [];
  const fields = [];
  const skipped = [];
  traverse(ast, {
    JSXElement(p) {
      const name = elementName(p.node);
      if (name === void 0) return;
      const isText = textNames.has(name);
      const isCollection = collectionNames.has(name);
      if (!isText && !isCollection) return;
      const line = p.node.loc?.start.line ?? 0;
      const use = isText ? "text" : "collection";
      const attr = keyAttribute(p.node);
      if (attr === void 0) {
        skipped.push({ line, text: `<${name}> without a k prop` });
        return;
      }
      const literal = literalAttribute(attr);
      if (literal !== void 0) {
        keys.push({ key: literal, line, use });
        return;
      }
      if (attr.value?.type === "JSXExpressionContainer" && attr.value.expression.type === "CallExpression") {
        if (itemKeyCall(attr.value.expression) !== void 0) return;
      }
      skipped.push({ line, text: sourceText(source, attr) });
    },
    CallExpression(p) {
      const line = p.node.loc?.start.line ?? 0;
      if (p.node.callee.type === "Identifier" && resolverNames.has(p.node.callee.name)) {
        const [arg] = p.node.arguments;
        if (arg !== void 0 && arg.type === "StringLiteral") keys.push({ key: arg.value, line, use: "resolve" });
        else skipped.push({ line, text: sourceText(source, p.node) });
        return;
      }
      const call = itemKeyCall(p.node);
      if (call === void 0) return;
      const scope = scopeFor(p, call.binding, collectionNames);
      if (scope === void 0) {
        skipped.push({ line, text: sourceText(source, p.node) });
        return;
      }
      fields.push({
        root: scope.root,
        chain: scope.chain,
        field: call.field,
        line,
        use: keyUseForCall(p, textNames, collectionNames)
      });
    }
  });
  return { keys, fields, skipped };
}
export {
  collectAuthoredKeys
};
