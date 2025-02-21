import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { SortCriteria } from "../../utils/sort";

@Component({
  selector: "bkd-sortable-header",
  imports: [],
  templateUrl: "./sortable-header.component.html",
  styleUrl: "./sortable-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortableHeaderComponent<T extends string> {
  @Input() className = "";
  @Input() label = "";
  @Input() sortKey: T;
  @Input() currentSort: SortCriteria<T>;
  @Output() sortRequested = new EventEmitter<T>();

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
