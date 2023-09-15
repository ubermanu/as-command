export function trimLeft(str: string, char: string = ' '): string {
  let i = 0
  while (i < str.length && str.charAt(i) === char) {
    i++
  }
  return str.slice(i)
}
