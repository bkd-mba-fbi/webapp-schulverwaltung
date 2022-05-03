import { Injectable } from '@angular/core';
import { map, ReplaySubject, switchMap, tap } from 'rxjs';
import { CoursesRestService } from './courses-rest.service';
import { LoadingService } from './loading-service';

@Injectable({
  providedIn: 'root',
})
export class DossierGradesService {
  private studentId$ = new ReplaySubject<number>(1);

  studentCourses$ = this.loadCoursesForStudent();
  loading$ = this.loadingService.loading$;

  constructor(
    private coursesRestService: CoursesRestService,
    private loadingService: LoadingService
  ) {}

  setStudentId(id: number) {
    this.studentId$.next(id);
  }

  private loadCoursesForStudent() {
    return this.studentId$.pipe(switchMap(this.loadCourses.bind(this)));
  }

  private loadCourses(studentId: number) {
    return this.loadingService.load(
      this.coursesRestService
        .getExpandedCoursesForDossier()
        .pipe(
          map((courses) =>
            courses.filter((course) =>
              course.ParticipatingStudents?.find(
                (student) => student.Id === studentId
              )
            )
          )
        )
    );
  }
}
