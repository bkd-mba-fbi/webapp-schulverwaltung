import { Injectable } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { ReplaySubject, shareReplay } from 'rxjs';
import { LoadingService } from '../../shared/services/loading-service';
import { CoursesRestService } from '../../shared/services/courses-rest.service';

@Injectable()
export class MyGradesService {
  studentId$ = new ReplaySubject<number>(1);

  loading$ = this.loadingService.loading$;

  studentCourses$ = this.loadCourses().pipe(shareReplay(1));
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

  private loadCourses() {
    return this.loadingService.load(
      this.coursesRestService.getExpandedCoursesForStudent()
    );
  }
}
