import { NgClass } from "@angular/common";
import { Component, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import {
  INITIAL_TESTS_FILTER,
  TestsFilter,
} from "../../../services/test-state.service";

@Component({
  selector: "bkd-tests-table-filter",
  imports: [NgClass, FormsModule, TranslatePipe],
  templateUrl: "./tests-table-filter.component.html",
  styleUrl: "./tests-table-filter.component.scss",
})
export class TestsTableFilterComponent {
  readonly filter = model<TestsFilter>(INITIAL_TESTS_FILTER);

  showOnlyMine(): void {
    this.filter.update((current) => ({ ...current, onlyMine: true }));
  }

  showAll(): void {
    this.filter.update((current) => ({ ...current, onlyMine: false }));
  }

  onHidePublishedChange(event: Event): void {
    const hidePublished =
      (event.target &&
        event.target instanceof HTMLInputElement &&
        event.target?.checked) ??
      false;
    this.filter.update((current) => ({ ...current, hidePublished }));
  }
}
