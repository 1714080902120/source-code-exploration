export default {
  error: (str: string) => { throw new Error(str) },
  isEmptyMap: (obj: Object) => Object.keys(obj).length > 0
}