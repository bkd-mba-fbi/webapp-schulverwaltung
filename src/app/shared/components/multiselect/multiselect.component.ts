import { Component, EventEmitter, Input, Output, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslatePipe } from "@ngx-translate/core";
import { DropDownGroupedItem } from "../../models/drop-down-grouped-item.model";
import { DropDownItem } from "../../models/drop-down-item.model";

@Component({
  selector: "bkd-multiselect",
  templateUrl: "./multiselect.component.html",
  styleUrls: ["./multiselect.component.scss"],
  imports: [NgSelectModule, FormsModule, TranslatePipe],
})
export class MultiselectComponent {
  readonly options = input<ReadonlyArray<DropDownGroupedItem>>([]);
  @Input() values: Option<ReadonlyArray<DropDownItem["Key"]>> = [];
  @Output() valuesChange = new EventEmitter<
    Option<ReadonlyArray<DropDownItem["Key"]>>
  >();

  constructor() {}

  itemsChanged(): void {
    this.valuesChange.emit(this.values);
  }
}
