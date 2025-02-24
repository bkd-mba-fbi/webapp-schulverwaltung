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
  templateUrl: "./sortable-header.component.html",
  styleUrl: "./sortable-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortableHeaderComponent<T extends string | object> {
  @Input() className = "";
  @Input() label = "";
  @Input() sortKey: T;
  @Input() sortCriteria: SortCriteria<T>;
  @Output() sortRequested = new EventEmitter<T>();

  get sortDirectionCharacter(): string {
    if (!this.sortCriteria) return "";
    if (this.sortCriteria.primarySortKey !== this.sortKey) return "";

    // Change to: If ascending is true, show '↓', else '↑'?
    return this.sortCriteria.ascending ? "↓" : "↑";
  }

  onHeaderClick() {
    this.sortRequested.emit(this.sortKey);
  }
}
