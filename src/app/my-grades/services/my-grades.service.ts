import { Injectable } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import {
  distinctUntilChanged,
  map,
  ReplaySubject,
  shareReplay,
  switchMap,
} from 'rxjs';
import { LoadingService } from '../../shared/services/loading-service';
import { CoursesRestService } from '../../shared/services/courses-rest.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class MyGradesService {
  studentId$ = new ReplaySubject<number>(1);

  loading$ = this.loadingService.loading$;

  studentCourses$ = this.studentId$.pipe(
    distinctUntilChanged(),
    tap((id) => console.log('id', id)),
    switchMap(this.loadCourses.bind(this)),
    shareReplay(1),
    tap((courses) => console.log('courses', courses))
  );

  constructor(
    private storageService: StorageService,
    private loadingService: LoadingService,
    private coursesRestService: CoursesRestService
  ) {
    const studentId = this.storageService.getPayload()?.id_person || null;
    if (studentId) {
      this.studentId$.next(studentId);
    }
  }

  private loadCourses(studentId: number) {
    return this.loadingService.load(
      this.coursesRestService
        .getExpandedCoursesForStudent()
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
