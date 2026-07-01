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
export class SortableHeaderComponent<TSortKey extends SortKey> {
  readonly label = input<string>("");
  readonly sortKey = input.required<TSortKey>();
  readonly sortCriteria = model.required<Option<SortCriteria<TSortKey>>>();

  isSorted = computed(
    () => this.sortCriteria()?.primarySortKey === this.sortKey(),
  );

  sortDirectionCharacter = computed(() =>
    this.isSorted() ? (this.sortCriteria()?.ascending ? "↓" : "↑") : "",
  );

  toggleSort(): void {
    const currentAscending = this.sortCriteria()?.ascending ?? null;
    this.sortCriteria.set({
      primarySortKey: this.sortKey(),
      ascending:
        this.isSorted() && currentAscending !== null ? !currentAscending : true,
    });
  }
}
