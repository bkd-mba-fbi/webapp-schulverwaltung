export function average(values: number[], fractionDigits: number) {
  return Number((sum(values) / values.length).toFixed(fractionDigits));
}

function sum(numbers: number[]) {
  return numbers.reduce(add, 0);
}

function add(a: number, b: number) {
  return a + b;
}
