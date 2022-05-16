import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TestGradesResult,
  UpdatedTestResultResponse,
} from 'src/app/shared/models/course.model';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { Result, Test } from 'src/app/shared/models/test.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';

@Component({
  selector: 'erz-dossier-grades-edit',
  templateUrl: './dossier-grades-edit.component.html',
  styleUrls: ['./dossier-grades-edit.component.scss'],
})
export class DossierGradesEditComponent {
  @Input() test: Test;
  @Input() gradeId: Option<number>;
  @Input() gradeOptions: Option<DropDownItem[]>;
  @Input() studentId: number;

  selected: number;
  updated: UpdatedTestResultResponse;

  constructor(
    public activeModal: NgbActiveModal,
    private courseService: CoursesRestService
  ) {}

  onSelectionChange(selected: number): void {
    this.selected = selected;
    this.updateTestResult(selected);
  }

  private updateTestResult(selected: number): void {
    const result: TestGradesResult = {
      StudentIds: [this.studentId],
      TestId: this.test.Id,
      GradeId: selected,
    };
    this.courseService
      .updateTestResult(this.test.CourseId, result)
      .subscribe((body) => {
        this.updated = body;
      });
  }

  get updatedTestResult(): Option<Result> {
    return this.updated?.TestResults[0];
  }
}
