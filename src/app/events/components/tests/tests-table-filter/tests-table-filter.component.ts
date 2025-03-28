import { NgClass } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
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
  @Input() filter: TestsFilter = INITIAL_TESTS_FILTER;
  @Output() filterChange = new EventEmitter<TestsFilter>();

  showOnlyMine(): void {
    this.filterChange.next({ ...this.filter, onlyMine: true });
  }

  showAll(): void {
    this.filterChange.next({ ...this.filter, onlyMine: false });
  }

  onHidePublishedChange(event: Event): void {
    const hidePublished =
      (event.target &&
        event.target instanceof HTMLInputElement &&
        event.target?.checked) ??
      false;
    this.filterChange.next({ ...this.filter, hidePublished });
  }
}
