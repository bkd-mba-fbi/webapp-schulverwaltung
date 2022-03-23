import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, distinctUntilChanged, finalize, map } from 'rxjs';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';

@Component({
  selector: 'erz-tests-add',
  templateUrl: './tests-add.component.html',
  styleUrls: ['./tests-add.component.scss'],
})
export class TestsAddComponent {
  saving$ = new BehaviorSubject(false);

  courseId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    distinctUntilChanged()
  );

  constructor(
    private route: ActivatedRoute,
    private courseService: CoursesRestService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  save(formGroup: FormGroup): void {
    this.saving$.next(true);
    const {
      designation,
      date,
      weight,
      isPointGrading,
      maxPoints,
      maxPointsAdjusted,
    } = formGroup.value;
    this.courseId$
      .pipe(
        map((courseId) =>
          this.courseService.add(
            courseId,
            new Date(date.year, date.month - 1, date.day), // TODO
            designation,
            weight,
            isPointGrading,
            maxPoints,
            maxPointsAdjusted
          )
        ),
        finalize(() => this.saving$.next(false))
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.toastr.success(this.translate.instant('tests.form.save-success'));
    this.navigateBack();
  }

  private navigateBack(): void {
    this.courseId$.subscribe((id) =>
      this.router.navigate(['events', id, 'tests'])
    );
  }
}
