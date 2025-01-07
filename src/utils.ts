export const BACKSPACE_KEY_CODE = 8;
export const DELETE_KEY_CODE = 46;

export function noop(): void {}

export function range(start: number, length: number): number[] {
  return Array.from({ length }, (_, i) => i + start);
}

export function hasFocus(el: HTMLElement): boolean {
  try {
    const matches = el.webkitMatchesSelector || el.matches;
    return matches.call(el, ":focus");
  } catch (err: any) {
    return false;
  }
}
