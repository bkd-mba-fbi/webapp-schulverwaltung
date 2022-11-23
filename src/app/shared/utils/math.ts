export interface ValueWithWeight {
  value: number;
  weight: number;
}

export function weightedAverage(values: ValueWithWeight[]): number {
  if (values.length === 0) return 0;

  return (
    sum(values.map(({ value, weight }) => value * weight)) /
    sum(values.map(({ weight }) => weight))
  );
}

export function average(values: number[]) {
  return values.length === 0 ? 0 : Number(sum(values) / values.length);
}

function sum(numbers: number[]) {
  return numbers.reduce(add, 0);
}

function add(a: number, b: number) {
  return a + b;
}
