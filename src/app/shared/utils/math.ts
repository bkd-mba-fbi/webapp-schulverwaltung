export function average(values: number[]) {
  return Number(sum(values) / values.length);
}

function sum(numbers: number[]) {
  return numbers.reduce(add, 0);
}

function add(a: number, b: number) {
  return a + b;
}
