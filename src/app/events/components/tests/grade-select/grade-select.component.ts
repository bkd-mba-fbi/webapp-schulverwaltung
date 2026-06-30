import { Component, EventEmitter, Input, Output, input } from "@angular/core";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { SelectComponent } from "../../../../shared/components/select/select.component";

@Component({
  selector: "bkd-grade-select",
  templateUrl: "./grade-select.component.html",
  imports: [SelectComponent],
})
export class GradeSelectComponent {
  readonly options = input<DropDownItem[]>();
  readonly valueId = input<Option<number>>(); // the selected key from the options list
  @Input() gradeId: Option<number>; // the id of the grade itself
  readonly disabled = input<boolean>(false);
  readonly width = input<string>("127px"); // 13ch

  @Output() gradeIdSelected = new EventEmitter<{
    id: number;
    selectedGradeId: Option<number>;
  }>();

  constructor() {}

  onGradeChange(selectedGradeId: Option<DropDownItem["Key"]>): void {
    if (this.gradeId != null) {
      this.gradeIdSelected.emit({
        id: this.gradeId,
        selectedGradeId:
          selectedGradeId == null ? null : Number(selectedGradeId),
      });
    }
  }
}
