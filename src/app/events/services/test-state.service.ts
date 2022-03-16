import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';

@Injectable()
export class TestStateService {
  loading$ = this.loadingService.loading$;
  search$ = new BehaviorSubject<string>('');

  // course$ = this.courseId$.pipe(switchMap((id) => this.state.getCourse(id)));

  // tests$ = this.course$.pipe(map((course) => course.Tests ?? []));

  constructor(
    private coursesRestService: CoursesRestService,
    private loadingService: LoadingService
  ) {}

  getCourse(id: number): Observable<Course> {
    return this.loadingService.load(
      this.coursesRestService.getExpandedCourse(id)
    );
  }
}
