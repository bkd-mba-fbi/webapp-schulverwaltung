import { Component, input, output } from "@angular/core";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { SelectComponent } from "../../../../shared/components/select/select.component";

@Component({
  selector: "bkd-grade-select",
  templateUrl: "./grade-select.component.html",
  imports: [SelectComponent],
})
export class GradeSelectComponent {
  readonly options = input.required<ReadonlyArray<DropDownItem>>();
  readonly valueId = input<Option<number>>(null); // the selected key from the options list
  readonly gradeId = input<Option<number>>(null); // the id of the grade itself
  readonly disabled = input<boolean>(false);
  readonly width = input<string>("127px"); // 13ch

  gradeIdSelected = output<{
    id: number;
    selectedGradeId: Option<number>;
  }>();

  constructor() {}

  onGradeChange(selectedGradeId: Option<DropDownItem["Key"]>): void {
    const gradeId = this.gradeId();
    if (gradeId != null) {
      this.gradeIdSelected.emit({
        id: gradeId,
        selectedGradeId:
          selectedGradeId == null ? null : Number(selectedGradeId),
      });
    }
  }
}
