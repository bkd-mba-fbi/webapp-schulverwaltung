import { NgFor } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { DropDownGroupedItem } from "../../models/drop-down-grouped-item.model";

@Component({
  selector: "bkd-multiselect",
  templateUrl: "./multiselect.component.html",
  styleUrls: ["./multiselect.component.scss"],
  standalone: true,
  imports: [NgSelectModule, FormsModule, NgFor, TranslateModule],
})
export class MultiselectComponent {
  @Input() options: ReadonlyArray<DropDownGroupedItem> = [];
  @Input() values: Option<number[]> = [];
  @Output() valuesChange = new EventEmitter<Option<number[]>>();

  constructor() {}

  itemsChanged(): void {
    this.valuesChange.emit(this.values);
  }
}
