import { Course, Grading } from 'src/app/shared/models/course.model';

export function updateGradings(newGrading: Grading, gradings: Grading[]) {
  return [
    ...gradings.filter((grading) => grading.Id !== newGrading.Id),
    newGrading,
  ];
}
