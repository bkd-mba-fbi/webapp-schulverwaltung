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
  private readonly translate = inject(TranslateService);

  protected readonly filter = model<TestsFilter>(INITIAL_TESTS_FILTER);

  protected readonly onlyMineOptions: ReadonlyArray<{
    key: string;
    label: string;
  }> = [
    { key: "all", label: this.translate.instant("tests.all-tests") },
    { key: "mine", label: this.translate.instant("tests.owned-tests") },
  ];

  protected readonly onlyMineValue = computed(() =>
    this.filter().onlyMine ? "mine" : "all",
  );

  onOnlyMineChange(value: Option<string>): void {
    this.filter.set({ ...this.filter(), onlyMine: value === "mine" });
  }

  protected onHidePublishedChange(event: Event): void {
    const hidePublished =
      (event.target &&
        event.target instanceof HTMLInputElement &&
        event.target?.checked) ??
      false;
    this.filter.update((current) => ({ ...current, hidePublished }));
  }
}
