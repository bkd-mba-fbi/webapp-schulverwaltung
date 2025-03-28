import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { SelectComponent } from "../../../../shared/components/select/select.component";

@Component({
  selector: "bkd-grade-select",
  templateUrl: "./grade-select.component.html",
  styleUrls: ["./grade-select.component.scss"],
  imports: [SelectComponent],
})
export class GradeSelectComponent {
  @Input() options: DropDownItem[];
  @Input() valueId: Option<number>; // the selected key from the options list
  @Input() gradeId: Option<number>; // the id of the grade itself
  @Input() disabled: boolean = false;
  @Input() width: string = "127px"; // 13ch

  @Output() gradeIdSelected = new EventEmitter<{
    id: number;
    selectedGradeId: Option<number>;
  }>();

  constructor() {}

  onGradeChange(selectedGradeId: Option<number>): void {
    if (this.gradeId?.valueOf() === undefined) return;
    this.gradeIdSelected.emit({ id: this.gradeId?.valueOf(), selectedGradeId });
  }
}
