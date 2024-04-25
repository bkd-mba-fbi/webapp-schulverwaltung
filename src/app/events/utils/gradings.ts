import { Grading } from "src/app/shared/models/course.model";

export function replaceGrading(newGrading: Grading, gradings: Grading[]) {
  return [
    ...gradings.filter((grading) => grading.Id !== newGrading?.Id),
    newGrading,
  ].filter((grading) => grading != undefined);
}
export function changeGrading(
  { id, selectedGradeId }: { id: number; selectedGradeId: Option<number> },
  gradings: Grading[],
) {
  return gradings.map((grade) =>
    grade.Id !== id ? grade : { ...grade, GradeId: selectedGradeId },
  );
}
