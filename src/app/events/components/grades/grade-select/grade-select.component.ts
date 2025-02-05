import { Component, EventEmitter, Output, input } from "@angular/core";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { SelectComponent } from "../../../../shared/components/select/select.component";

@Component({
  selector: "bkd-grade-select",
  templateUrl: "./grade-select.component.html",
  styleUrls: ["./grade-select.component.scss"],
  imports: [SelectComponent],
})
export class GradeSelectComponent {
  readonly options = input<DropDownItem[]>();
  readonly valueId = input<Option<number>>(); // the selected key from the options list
  readonly gradeId = input<Option<number>>(); // the id of the grade itself
  readonly disabled = input<boolean>(false);
  readonly width = input<string>("127px"); // 13ch

  @Output() gradeIdSelected = new EventEmitter<{
    id: number;
    selectedGradeId: Option<number>;
  }>();

  constructor() {}

  onGradeChange(selectedGradeId: Option<number>): void {
    const gradeId = this.gradeId();
    if (gradeId?.valueOf() === undefined) return;
    this.gradeIdSelected.emit({ id: gradeId?.valueOf(), selectedGradeId });
  }
}
