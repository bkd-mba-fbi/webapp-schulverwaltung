import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { Test } from 'src/app/shared/models/test.model';
import { StudentGradesService } from './student-grades.service';

export type Filter = 'all-tests' | 'my-tests';

@Injectable({
  providedIn: 'root',
})
export class TestEditGradesStateService {
  course: Course;

  filter$: BehaviorSubject<Filter> = new BehaviorSubject<Filter>('all-tests');

  tests$: Observable<Test[] | undefined> = this.filter$.pipe(
    map((filter) =>
      this.course.Tests?.filter((test) => {
        if (filter === 'all-tests') {
          return true;
        } else {
          return test.IsOwner;
        }
      })
    )
  );

  studentGrades$ = this.tests$.pipe(
    map((tests) =>
      this.studentGradesService.transform(
        this.course.ParticipatingStudents ?? [],
        tests ?? []
      )
    )
  );

  constructor(private studentGradesService: StudentGradesService) {}
}
