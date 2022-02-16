import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';

@Injectable()
export class CoursesStateService {
  loading$ = this.loadingService.loading$;

  courses$ = this.loadCourses();

  constructor(
    private coursesRestService: CoursesRestService,
    private loadingService: LoadingService
  ) {}

  loadCourses(): Observable<ReadonlyArray<Course>> {
    return this.loadingService.load(
      this.coursesRestService.getExpandedCourses()
    );
  }
}
