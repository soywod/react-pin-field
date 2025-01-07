export function noop(): void {}

export function range(start: number, length: number): number[] {
  return Array.from({ length }, (_, i) => i + start);
}
