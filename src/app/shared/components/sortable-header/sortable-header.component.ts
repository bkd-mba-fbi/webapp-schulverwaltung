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
  @Output() sortCriteriaChange = new EventEmitter<SortCriteria<T>>();

  get sortDirectionCharacter(): string {
    if (!this.isSorted) {
      return "";
    }
    return this.sortCriteria?.ascending ? "↓" : "↑";
  }

  toggleSort(): void {
    if (this.isSorted) {
      this.sortCriteria = {
        ...this.sortCriteria,
        ascending: !this.sortCriteria.ascending,
      };
    } else {
      this.sortCriteria = {
        primarySortKey: this.sortKey,
        ascending: this.sortKey === "name",
      };
    }
    this.sortCriteriaChange.emit(this.sortCriteria);
  }

  get isSorted(): boolean {
    return this.sortCriteria?.primarySortKey === this.sortKey;
  }
}
