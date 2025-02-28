import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

export type SortKey = string;

export interface SortCriteria<T extends SortKey> {
  primarySortKey: T;
  ascending: boolean;
}

@Component({
  selector: "bkd-sortable-header",
  templateUrl: "./sortable-header.component.html",
  styleUrl: "./sortable-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class SortableHeaderComponent<TPrimarySortKey extends SortKey> {
  className = input<string>("");
  label = input<string>("");
  sortKey = input.required<TPrimarySortKey>();
  sortCriteria = input.required<SortCriteria<TPrimarySortKey>>();
  sortCriteriaChange = output<SortCriteria<TPrimarySortKey>>();

  isSorted = computed(
    () => this.sortCriteria()?.primarySortKey === this.sortKey(),
  );

  sortDirectionCharacter = computed(() =>
    this.isSorted() ? (this.sortCriteria()?.ascending ? "↓" : "↑") : "",
  );

  toggleSort(): void {
    const { ascending: currentAscending } = this.sortCriteria();
    this.sortCriteriaChange.emit({
      primarySortKey: this.sortKey(),
      ascending: this.isSorted() ? !currentAscending : true,
    });
  }
}
