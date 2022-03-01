import { Component, Input } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { Test } from '../../../shared/models/test.model';
import { StudentGradesService } from '../../services/student-grades.service';

type Filter = 'all-tests' | 'my-tests';

@Component({
  selector: 'erz-test-edit-grades',
  templateUrl: './test-edit-grades.component.html',
  styleUrls: ['./test-edit-grades.component.scss'],
})
export class TestEditGradesComponent {
  @Input() course: Course;
  @Input() selectedTest: Test;

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

  changeFilter(filter: Filter) {
    this.filter$.next(filter);
  }
}
