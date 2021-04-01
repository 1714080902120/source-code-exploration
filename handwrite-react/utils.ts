import { Map } from "./type";

interface Utils {
  objKeys: (obj: Map) => any[];
  objValues: (obj: Map) => any[];
  isListeners: (key: string) => boolean;
  isAttributes: (key: string) => boolean;
  setItem: (name: string, value: string) => void;
  getItem: (name: string) => string | null;
  toString: (value: any) => string;
  toOriginal: (value: string) => any;
  isString: (value: any) => boolean;
}

const { keys, values } = Object
const { localStorage } = window

const objKeys = (obj: Map) => keys(obj)

const objValues = (obj: Map) => values(obj)

const isListeners = (key: string) => (/on/).test(key)

const isAttributes = (key: string) => !(/on/).test(key)

const setItem = (name: string, value: string) => localStorage.setItem(name, value)

const getItem = (name: string) => localStorage.getItem(name)

const toString = (value: any) => JSON.stringify(value)

const toOriginal = (value: string) => JSON.parse(value)

const isString = (value: any) => typeof value === 'string'

export const utils: Utils = {
  objKeys,
  objValues,
  isListeners,
  isAttributes,
  setItem,
  getItem,
  toString,
  toOriginal,
  isString
}