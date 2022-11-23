import { average, weightedAverage } from './math';

describe('math utils', () => {
  describe('weighted average', () => {
    it('should calculate the weighted average', () => {
      const values = [
        { value: 5.1, weight: 1 },
        { value: 4.7, weight: 0.5 },
        { value: 5.2, weight: 1 },
      ];
      expect(weightedAverage(values)).toBe(5.06);
    });

    it('should calculate the weighted average - empty array', () => {
      expect(weightedAverage([])).toBe(0);
    });
  });

  describe('average', () => {
    it('should return average', () => {
      expect(average([5.1, 4.7, 5.2])).toBe(5);
    });

    it('should return average - empty array', () => {
      expect(average([])).toBe(0);
    });
  });
});
