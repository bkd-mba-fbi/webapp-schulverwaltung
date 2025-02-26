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
})
export class SortableHeaderComponent<TPrimarySortKey extends SortKey> {
  className = input<string>("");
  label = input<string>("");
  sortKey = input<TPrimarySortKey>();
  sortCriteria = input.required<SortCriteria<TPrimarySortKey>>();
  sortCriteriaChange = output<SortCriteria<TPrimarySortKey>>();

  isSorted = computed(
    () => this.sortCriteria()?.primarySortKey === this.sortKey(),
  );

  sortDirectionCharacter = computed(() =>
    this.isSorted() ? (this.sortCriteria()?.ascending ? "↓" : "↑") : "",
  );

  toggleSort(): void {
    const current = this.sortCriteria();
    let newCriteria: SortCriteria<TPrimarySortKey>;
    if (this.isSorted()) {
      newCriteria = {
        primarySortKey: current.primarySortKey,
        ascending: !current.ascending,
      };
    } else {
      newCriteria = {
        primarySortKey: this.sortKey()!,
        ascending: this.sortKey() === "name",
      };
    }
    this.sortCriteriaChange.emit(newCriteria);
  }
}
