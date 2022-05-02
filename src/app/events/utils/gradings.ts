import { Grading } from 'src/app/shared/models/course.model';

export function updateGradings(newGrading: Grading, gradings: Grading[]) {
  return [
    ...gradings.filter((grading) => grading.Id !== newGrading.Id),
    newGrading,
  ];
}
export function changeGrading(
  { id, selectedGradeId }: { id: number; selectedGradeId: number },
  gradings: Grading[]
) {
  return gradings.map((grade) =>
    grade.Id !== id ? grade : { ...grade, GradeId: selectedGradeId }
  );
}
