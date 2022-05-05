import { Injectable } from '@angular/core';
import {
  combineLatest,
  forkJoin,
  map,
  ReplaySubject,
  share,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Course } from '../models/course.model';
import { Test } from '../models/test.model';
import { notNull, unique } from '../utils/filter';
import { CoursesRestService } from './courses-rest.service';
import { GradingScalesRestService } from './grading-scales-rest.service';
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
    private loadingService: LoadingService,
    private gradingScalesRestService: GradingScalesRestService
  ) {}

  setStudentId(id: number) {
    this.studentId$.next(id);
  }

  private loadCoursesForStudent() {
    return this.studentId$.pipe(
      switchMap(this.loadCourses.bind(this)),
      shareReplay(1)
    );
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

  // TODO: code below this is a duplication from the test-edit-state service that
  // was refactored by mfehlmann and hupf on another branch.
  // if it is merged, integrate changes and dry it up.

  private tests$ = this.studentCourses$.pipe(
    map((courses: Course[]) =>
      courses.flatMap((course: Course) => course.Tests).filter(notNull)
    )
  );

  private gradingScaleIdsFromTests$ = this.tests$.pipe(
    map((tests: Test[]) =>
      [...tests.map((test: Test) => test.GradingScaleId)].filter(unique)
    )
  );

  private gradingScaleIdsFromCourses$ = this.studentCourses$.pipe(
    map((courses: Course[]) =>
      courses
        .flatMap((course: Course) => course.GradingScaleId)
        .filter(notNull)
        .filter(unique)
    )
  );

  private gradingScaleIds$ = combineLatest([
    this.gradingScaleIdsFromCourses$,
    this.gradingScaleIdsFromTests$,
  ]).pipe(
    map(([courseGradingsScaleIds, testGradingScaleIds]: [number[], number[]]) =>
      courseGradingsScaleIds.concat(testGradingScaleIds).filter(unique)
    )
  );

  gradingScales$ = this.gradingScaleIds$.pipe(
    switchMap((ids) =>
      forkJoin(
        ids.map((id: number) =>
          this.gradingScalesRestService.getGradingScale(id)
        )
      )
    )
  );
}
