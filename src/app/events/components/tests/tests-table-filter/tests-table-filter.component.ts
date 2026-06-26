import { Component, computed, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { ButtonGroupComponent } from "src/app/shared/components/button-group/button-group.component";
import {
  INITIAL_TESTS_FILTER,
  TestsFilter,
} from "../../../services/test-state.service";

@Component({
  selector: "bkd-tests-table-filter",
  imports: [FormsModule, TranslatePipe, ButtonGroupComponent],
  templateUrl: "./tests-table-filter.component.html",
  styleUrl: "./tests-table-filter.component.scss",
})
export class TestsTableFilterComponent {
  private translate = inject(TranslateService);

  filter = model<TestsFilter>(INITIAL_TESTS_FILTER);

  onlyMineOptions = [
    { key: "all", label: this.translate.instant("tests.all-tests") },
    { key: "mine", label: this.translate.instant("tests.owned-tests") },
  ];

  onlyMineValue = computed(() => (this.filter().onlyMine ? "mine" : "all"));

  onOnlyMineChange(value: Option<string>): void {
    this.filter.set({ ...this.filter(), onlyMine: value === "mine" });
  }

  onHidePublishedChange(event: Event): void {
    const hidePublished =
      (event.target &&
        event.target instanceof HTMLInputElement &&
        event.target?.checked) ??
      false;
    this.filter.set({ ...this.filter(), hidePublished });
  }
}
