import { Grading } from 'src/app/shared/models/course.model';
import { updateGradings } from './gradings';

describe('Gradings utils', () => {
  it('should add grading when gradings are empty', () => {
    const grading = {} as Grading;

    expect(updateGradings(grading, [])).toEqual([grading]);
  });

  it('should replace grading by id', () => {
    const grading = { Id: 12345, GradeId: 333 } as Grading;
    const gradingToReplace = ({
      Id: 12345,
      GradeId: 111,
    } as unknown) as Grading;
    const gradings = [
      gradingToReplace,
      ({ Id: 33333, GradeId: 113 } as unknown) as Grading,
      ({ Id: 11111, GradeId: 123 } as unknown) as Grading,
    ];

    const result = updateGradings(grading, gradings);

    expect(result.length).toBe(3);
    expect(result).toContain(grading);
    expect(result).not.toContain(gradingToReplace);
  });
});
