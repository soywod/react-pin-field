export function noop(): void {}

export function range(start: number, length: number): number[] {
  return Array.from({ length }, (_, i) => i + start);
}

export function omit<T extends Record<string, unknown>>(keys: string[], input: T): T {
  let output: T = Object.create({});

  for (let key in input) {
    if (!keys.includes(key)) {
      Object.assign(output, { [key]: input[key] });
    }
  }

  return output;
}
