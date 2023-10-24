import { Grading } from 'src/app/shared/models/course.model';
import { changeGrading, replaceGrading } from './gradings';

describe('Gradings utils', () => {
  const gradingToReplace = {
    Id: 12345,
    GradeId: 111,
  } as unknown as Grading;
  const gradings = [
    gradingToReplace,
    { Id: 33333, GradeId: 113 } as unknown as Grading,
    { Id: 11111, GradeId: 123 } as unknown as Grading,
  ];
  describe('replace grading in list of grading', () => {
    it('should add grading when gradings are empty', () => {
      const grading = {} as Grading;

      expect(replaceGrading(grading, [])).toEqual([grading]);
    });

    it('should replace grading by id', () => {
      const grading = { Id: 12345, GradeId: 333 } as Grading;

      const result = replaceGrading(grading, gradings);

      expect(result.length).toBe(3);
      expect(result).toContain(grading);
      expect(result).not.toContain(gradingToReplace);
    });
  });

  describe('change gradings', () => {
    it('should do nothing if no grading exists', () => {
      expect(changeGrading({ id: 1, selectedGradeId: 1 }, [])).toEqual([]);
    });

    it('should change to gradeId of the given grade', () => {
      const result = changeGrading(
        { id: 12345, selectedGradeId: 999 },
        gradings,
      );

      expect(result.length).toBe(3);
      expect(result).not.toContain(gradingToReplace);
      const changedGrading = result.find((grade) => grade.Id === 12345);

      expect(changeGrading).not.toBeNull();
      expect(changedGrading?.GradeId).toBe(999);
    });
  });
});
