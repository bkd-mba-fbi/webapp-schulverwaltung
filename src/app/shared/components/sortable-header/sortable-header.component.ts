import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { SortCriteria } from "../../utils/sort";

export type PrimarySortKey = "name" | "group" | "date" | "registrationDate";

@Component({
  selector: "bkd-sortable-header",
  imports: [],
  templateUrl: "./sortable-header.component.html",
  styleUrl: "./sortable-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortableHeaderComponent {
  @Input() label = "";
  @Input() sortKey: PrimarySortKey;
  @Input() currentSort: SortCriteria<string>;
  @Output() sortRequested = new EventEmitter<PrimarySortKey>();

  get sortDirectionCharacter(): string {
    if (!this.currentSort) return "";
    if (this.currentSort.primarySortKey !== this.sortKey) return "";

    // Change to: If ascending is true, show '↓', else '↑'?
    return this.currentSort.ascending ? "↓" : "↑";
  }

  onHeaderClick() {
    this.sortRequested.emit(this.sortKey);
  }
}
