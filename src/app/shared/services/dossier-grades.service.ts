import { Injectable } from '@angular/core';
import { map, ReplaySubject, switchMap, tap } from 'rxjs';
import { CoursesRestService } from './courses-rest.service';

@Injectable({
  providedIn: 'root',
})
export class DossierGradesService {
  private studentId$ = new ReplaySubject<number>(1);

  studentCourses$ = this.studentId$.pipe(
    switchMap(this.loadCourses.bind(this))
  );

  constructor(private coursesRestService: CoursesRestService) {}

  setStudentId(id: number) {
    this.studentId$.next(id);
  }

  private loadCourses(studentId: number) {
    return this.coursesRestService.getExpandedCoursesForDossier().pipe(
      map((courses) =>
        courses.filter((course) =>
          course.ParticipatingStudents?.find(
            (student) => student.Id === studentId
          )
        )
      ),
      tap(console.log)
    );
  }
}
