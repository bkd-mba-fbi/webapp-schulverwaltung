import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, ReplaySubject } from 'rxjs';
import {
  replaceResultInTest,
  resultOfStudent,
} from 'src/app/events/utils/tests';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import { Result, Test } from 'src/app/shared/models/test.model';
import { DossierGradesEditComponent } from '../dossier-grades-edit/dossier-grades-edit.component';
import { DossierGradesService } from '../../../services/dossier-grades.service';

@Component({
  selector: 'erz-dossier-single-test',
  template: ` <div class="test-entry" *erzLet="test$ | async as test">
    <div class="designation" data-testid="test-designation">
      {{ test.Designation }}
    </div>
    <div class="date" data-testid="test-date">
      {{ test.Date | date: 'dd.MM.yyyy' }}
    </div>
    <div class="grade">
      <a
        *ngIf="isEditable && test.IsOwner; else notEditable"
        class="btn btn-link"
        aria-label="edit grade"
        (click)="editGrading(test)"
      >
        <i class="material-icons" data-testid="test-grade-edit-icon">edit</i>
        <span data-testid="test-grade">{{ grading$ | async }}</span>
      </a>
      <ng-template #notEditable>
        <span data-testid="test-grade">{{ grading$ | async }}</span>
      </ng-template>
    </div>
    <div class="factor" data-testid="test-factor">
      {{ test | erzTestWeight }}
    </div>
    <div class="points" data-testid="test-points">
      <span>{{ test | erzTestPoints: studentId:'dossier.points' }}</span>
    </div>
    <div class="teacher" data-testid="test-teacher">
      {{ test.Owner }}
    </div>
    <div *ngIf="isEditable" class="state" data-testid="test-status">
      {{
        (test.IsPublished ? 'tests.published' : 'tests.not-published')
          | translate
      }}
    </div>
  </div>`,
  styleUrls: ['./dossier-single-test.component.scss'],
})
export class DossierSingleTestComponent implements OnChanges {
  @Input() test: Test;
  @Input() studentId: number;
  @Input() gradingScale: Option<GradingScale>;
  @Input() isEditable: boolean;

  test$ = new ReplaySubject<Test>(1);
  grading$ = this.test$.pipe(map(this.getGrading.bind(this)));

  constructor(
    private gradeService: DossierGradesService,
    private modalService: NgbModal
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.test) {
      this.test$.next(this.test);
    }
  }

  editGrading(test: Test): void {
    const modalRef = this.modalService.open(DossierGradesEditComponent, {
      backdrop: 'static', // prevent closing by click outside of modal
    });
    modalRef.componentInstance.test = test; // TODO
    modalRef.componentInstance.gradeId = this.getGradeId(test);
    modalRef.componentInstance.gradeOptions =
      DossierSingleTestComponent.mapToOptions(this.gradingScale);
    modalRef.componentInstance.studentId = this.studentId;
    modalRef.componentInstance.points = this.getPoints(test);

    modalRef.result.then(
      (updatedTestResult) => {
        if (updatedTestResult) this.updateStudentGrade(updatedTestResult, test);
      },
      () => {}
    );
  }

  private updateStudentGrade(result: Result, test: Test): void {
    const updatedTest = replaceResultInTest(result, test);
    this.gradeService.updateTest$.next(updatedTest);
  }

  private getGrading(test: Test): string {
    return (
      this.gradingScale?.Grades.find(
        (grade) => grade.Id === this.getGradeId(test)
      )?.Designation || '-'
    );
  }

  private getGradeId(test: Test): Option<number> {
    return resultOfStudent(this.studentId, test)?.GradeId || null;
  }

  // TODO dry up
  private getPoints(test: Test): Option<number> {
    return resultOfStudent(this.studentId, test)?.Points || null;
  }

  private static mapToOptions(
    gradingScale: Option<GradingScale>
  ): Option<DropDownItem[]> {
    return (
      gradingScale?.Grades.map((gradeOption) => {
        return {
          Key: gradeOption.Id,
          Value: gradeOption.Designation,
        };
      }) || null
    );
  }
}
