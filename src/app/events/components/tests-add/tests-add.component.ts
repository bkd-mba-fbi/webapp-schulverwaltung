import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
} from 'rxjs';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'erz-tests-add',
  templateUrl: './tests-add.component.html',
  styleUrls: ['./tests-add.component.scss'],
})
export class TestsAddComponent {
  saving$ = new BehaviorSubject(false);

  courseId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    distinctUntilChanged(),
  );

  constructor(
    private route: ActivatedRoute,
    private courseService: CoursesRestService,
    private toastService: ToastService,
    private translate: TranslateService,
    private router: Router,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(formGroupValue: any): void {
    this.saving$.next(true);
    const {
      designation,
      date,
      weight,
      isPointGrading,
      maxPoints,
      maxPointsAdjusted,
    } = formGroupValue;
    this.courseId$
      .pipe(
        switchMap((courseId) =>
          this.courseService.add(
            courseId,
            date,
            designation,
            weight,
            isPointGrading,
            maxPoints,
            maxPointsAdjusted,
          ),
        ),
        finalize(() => this.saving$.next(false)),
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.toastService.success(
      this.translate.instant('tests.form.save-success'),
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    this.courseId$.subscribe((id) =>
      this.router.navigate(['events', id, 'tests']),
    );
  }
}
