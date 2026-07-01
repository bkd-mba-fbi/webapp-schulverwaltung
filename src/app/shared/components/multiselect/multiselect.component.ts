import { Component, input, linkedSignal, model } from "@angular/core";
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
  readonly id = input<Option<string>>(null);
  readonly options = input<ReadonlyArray<DropDownGroupedItem>>([]);
  readonly values = model<Option<ReadonlyArray<DropDownItem["Key"]>>>([]);

  readonly intermediateValues = linkedSignal(() => this.values());

  constructor() {}

  itemsChanged(): void {
    this.values.set(this.intermediateValues());
  }
}
