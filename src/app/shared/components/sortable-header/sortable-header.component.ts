import { NgClass } from "@angular/common";
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
  imports: [NgClass],
})
export class SortableHeaderComponent<TPrimarySortKey extends SortKey> {
  className = input<string>("");
  label = input<string>("");
  sortKey = input.required<TPrimarySortKey>();
  sortCriteria = model<Option<SortCriteria<TPrimarySortKey>>>(null);

  isSorted = computed(
    () => this.sortCriteria()?.primarySortKey === this.sortKey(),
  );

  sortDirectionCharacter = computed(() =>
    this.isSorted() ? (this.sortCriteria()?.ascending ? "↓" : "↑") : "",
  );

  toggleSort(): void {
    const currentAscending = this.sortCriteria()?.ascending ?? true;
    this.sortCriteria.set({
      primarySortKey: this.sortKey(),
      ascending: this.isSorted() ? !currentAscending : true,
    });
  }
}
