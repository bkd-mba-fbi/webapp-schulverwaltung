import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";

@Component({
  selector: "erz-grade-select",
  templateUrl: "./grade-select.component.html",
  styleUrls: ["./grade-select.component.scss"],
})
export class GradeSelectComponent {
  @Input() options: DropDownItem[];
  @Input() valueId: Option<number>; // the selected key from the options list
  @Input() gradeId: Option<number>; // the id of the grade itself
  @Input() disabled: boolean = false;

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
