import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { SortCriteria } from "../../utils/sort";

@Component({
  selector: "bkd-sortable-header",
  templateUrl: "./sortable-header.component.html",
  styleUrl: "./sortable-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortableHeaderComponent<T extends string | object> {
  className = input<string>("");
  label = input<string>("");
  sortKey = input<T>();
  sortCriteria = input<SortCriteria<T>>({
    primarySortKey: "" as T,
    ascending: true,
  });
  showSortDirection = input<boolean>(true);
  sortCriteriaChange = output<SortCriteria<T>>();

  isSorted = computed(
    () =>
      this.showSortDirection() &&
      this.sortCriteria()?.primarySortKey === this.sortKey(),
  );

  sortDirectionCharacter = computed(() =>
    this.isSorted() ? (this.sortCriteria()?.ascending ? "↓" : "↑") : "",
  );

  toggleSort(): void {
    const current = this.sortCriteria();
    let newCriteria: SortCriteria<T>;
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
