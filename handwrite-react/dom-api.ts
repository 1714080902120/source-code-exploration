import { usualNodeType } from "./type";

export interface DOMAPI {
  createElement: (tagName: string) => HTMLElement;
  appendChild: (parentNode: HTMLElement, childNode: HTMLElement | Text) => void;
  createTextNode: (text: string) => Text;
  removeChild: (parentNode: usualNodeType, childNode: usualNodeType) => void;
  replaceChild: (parentNode: usualNodeType, newNode: usualNodeType, oldNode: usualNodeType) => void;
  insertBefore: (parentNode: usualNodeType, newNode: usualNodeType, refNode: usualNodeType) => void;

}

const createElement = (tagName: string) => document.createElement(tagName);

const createTextNode = (text: string) => document.createTextNode(text);

const appendChild = (parentNode: HTMLElement, childNode: HTMLElement | Text) =>
  parentNode.appendChild(childNode);

const removeChild = (parentNode: usualNodeType, childNode: usualNodeType) => parentNode.removeChild(childNode)

const replaceChild = (parentNode: usualNodeType, newNode: usualNodeType, oldNode: usualNodeType) => parentNode.replaceChild(newNode, oldNode)

const insertBefore = (parentNode: usualNodeType, newNode: usualNodeType, refNode: usualNodeType) => parentNode.insertBefore(newNode, refNode || null)

export const domApi: DOMAPI = {
  createElement,
  appendChild,
  createTextNode,
  removeChild,
  replaceChild,
  insertBefore
};
