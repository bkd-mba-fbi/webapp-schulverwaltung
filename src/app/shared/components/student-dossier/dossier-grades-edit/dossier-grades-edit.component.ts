import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TestGradesResult,
  TestPointsResult,
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
  @Input() points: number;
  @Input() studentId: number;

  selectedGrade: number;
  response: UpdatedTestResultResponse;

  constructor(
    public activeModal: NgbActiveModal,
    private courseService: CoursesRestService
  ) {}

  onGradeChange(selectedGradeId: number): void {
    this.selectedGrade = selectedGradeId;
    const result: TestGradesResult = {
      StudentIds: [this.studentId],
      TestId: this.test.Id,
      GradeId: selectedGradeId,
    };
    this.updateTestResult(result);
  }

  onPointsChange(points: string): void {
    // TODO debounce
    const result: TestPointsResult = {
      StudentIds: [this.studentId],
      TestId: this.test.Id,
      Points: Number(points), // TODO validate
    };

    this.updateTestResult(result); // TODO update grade on modal
  }

  private updateTestResult(result: TestPointsResult | TestGradesResult): void {
    this.courseService
      .updateTestResult(this.test.CourseId, result)
      .subscribe((body) => {
        this.response = body;
      });
  }

  get updatedTestResult(): Option<Result> {
    return this.response?.TestResults[0];
  }
}
