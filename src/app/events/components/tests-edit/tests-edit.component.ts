import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
} from 'rxjs';
import { Test } from 'src/app/shared/models/test.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { TestStateService } from '../../services/test-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestsDeleteComponent } from './tests-delete/tests-delete.component';

@Component({
  selector: 'erz-tests-edit',
  templateUrl: './tests-edit.component.html',
  styleUrls: ['./tests-edit.component.scss'],
})
export class TestsEditComponent {
  saving$ = new BehaviorSubject(false);

  courseId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    distinctUntilChanged()
  );

  private testId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('testId'))),
    distinctUntilChanged()
  );
  private tests$ = this.courseId$.pipe(
    switchMap((id) => this.state.getCourse(id)),
    map((course) => course.Tests ?? [])
  );
  test$ = combineLatest([this.tests$, this.testId$]).pipe(
    map(([tests, id]) => tests.find((t) => t.Id === id))
  );

  constructor(
    public state: TestStateService,
    private courseService: CoursesRestService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  delete(test: Test): void {
    if (test.Results && test.Results.length > 0) {
      alert(this.translate.instant('tests.form.delete-not-allowed'));
      return;
    }

    if (confirm(this.translate.instant('tests.form.confirm'))) {
      this.courseService
        .delete(test.CourseId, test.Id)
        .subscribe(this.onDeleteSuccess.bind(this));
    }
  }

  openDeleteModal(test: Test) {
    const modalRef = this.modalService.open(TestsDeleteComponent);
    modalRef.componentInstance.test = test;
    modalRef.componentInstance.canConfirm = !(
      test.Results && test.Results.length > 0
    );
    modalRef.result.then(
      (result) => {
        if (result) {
          this.courseService
            .delete(test.CourseId, test.Id)
            .subscribe(this.onDeleteSuccess.bind(this));
        }
      },
      () => {}
    );
  }

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
    combineLatest([this.courseId$, this.testId$])
      .pipe(
        switchMap(([courseId, testId]) =>
          this.courseService.update(
            courseId,
            testId,
            designation,
            date,
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
