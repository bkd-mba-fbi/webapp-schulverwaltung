import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
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
  label = input<string>("");
  sortKey = input.required<TPrimarySortKey>();
  sortCriteria = model.required<SortCriteria<TPrimarySortKey>>();

  isSorted = computed(
    () => this.sortCriteria()?.primarySortKey === this.sortKey(),
  );

  sortDirectionCharacter = computed(() =>
    this.isSorted() ? (this.sortCriteria()?.ascending ? "↓" : "↑") : "",
  );

  toggleSort(): void {
    const { ascending: currentAscending } = this.sortCriteria();
    this.sortCriteria.set({
      primarySortKey: this.sortKey(),
      ascending: this.isSorted() ? !currentAscending : true,
    });
  }
}
