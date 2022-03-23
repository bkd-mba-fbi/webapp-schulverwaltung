import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, distinctUntilChanged, map, switchMap } from 'rxjs';
import { Test } from 'src/app/shared/models/test.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { TestStateService } from '../../services/test-state.service';

@Component({
  selector: 'erz-tests-edit',
  templateUrl: './tests-edit.component.html',
  styleUrls: ['./tests-edit.component.scss'],
})
export class TestsEditComponent {
  courseId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    distinctUntilChanged()
  );

  private testId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('testId')))
  );
  private tests$ = this.courseId$.pipe(
    switchMap((id) => this.state.getCourse(id)),
    map((course) => course.Tests ?? [])
  );
  test$ = combineLatest([this.tests$, this.testId$]).pipe(
    map(([tests, id]) => tests.find((t) => t.Id === id))
  );

  constructor(
    private state: TestStateService,
    private courseService: CoursesRestService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  delete(test: Test): void {
    if (confirm(this.translate.instant('tests.form.confirm'))) {
      this.courseService
        .delete(test.CourseId, test.Id)
        .subscribe(this.onDeleteSuccess.bind(this));
    }
  }

  private onDeleteSuccess(): void {
    this.toastr.success(this.translate.instant('tests.form.delete-success'));
    this.navigateBack();
  }

  private navigateBack(): void {
    this.courseId$.subscribe((id) =>
      this.router.navigate(['events', id, 'tests'])
    );
  }
}
