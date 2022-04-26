import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';

@Component({
  selector: 'erz-grade-select',
  templateUrl: './grade-select.component.html',
  styleUrls: ['./grade-select.component.scss'],
})
export class GradeSelectComponent {
  @Input() options: DropDownItem[];
  @Input() gradeId: Option<number>;

  @Output() selectedGradeId = new EventEmitter<number>();

  constructor() {}

  onGradeChange(gradeId: number): void {
    this.selectedGradeId.emit(gradeId);
  }
}
