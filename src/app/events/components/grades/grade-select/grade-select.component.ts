import { Component, EventEmitter, Input, Output } from '@angular/core';
import { number } from 'io-ts';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { FinalGrade } from 'src/app/shared/models/student-grades';

@Component({
  selector: 'erz-grade-select',
  templateUrl: './grade-select.component.html',
  styleUrls: ['./grade-select.component.scss'],
})
export class GradeSelectComponent {
  @Input() options: DropDownItem[];
  @Input() selectedGradeId: Option<number>; // the selected grade - id from gradingscale
  @Input() gradeId: Option<number>; // the id of the grade itself

  @Output() gradeIdSelected = new EventEmitter<{
    id: number;
    selectedGradeId: number;
  }>();

  constructor() {}

  onGradeChange(selectedGradeId: number): void {
    if (this.gradeId?.valueOf() === undefined) return;
    this.gradeIdSelected.emit({ id: this.gradeId?.valueOf(), selectedGradeId });
  }
}
