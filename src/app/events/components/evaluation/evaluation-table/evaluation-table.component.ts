import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  computed,
  effect,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { average } from "src/app/shared/utils/math";
import { SubscriptionDetailFieldComponent } from "../../../../shared/components/subscription-detail-field/subscription-detail-field.component";
import { DecimalOrDashPipe } from "../../../../shared/pipes/decimal-or-dash.pipe";
import {
  EvaluationColumn,
  EvaluationEntry,
  EvaluationSortKey,
  EvaluationSubscriptionDetail,
} from "../../../services/evaluation-state.service";
import { TableHeaderStickyDirective } from "../../common/table-header-sticky/table-header-sticky.directive";
import { EvaluationCriteriaComponent } from "../evaluation-criteria/evaluation-criteria.component";
import { GRADE_COLUMN_KEY } from "../evaluation-list/evaluation-list.component";
import { EvaluationTableHeaderComponent } from "../evaluation-table-header/evaluation-table-header.component";

@Component({
  selector: "bkd-evaluation-table",
  imports: [
    RouterLink,
    TranslatePipe,
    EvaluationTableHeaderComponent,
    TableHeaderStickyDirective,
    DecimalOrDashPipe,
    SubscriptionDetailFieldComponent,
    EvaluationCriteriaComponent,
  ],
  templateUrl: "./evaluation-table.component.html",
  styleUrl: "./evaluation-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationTableComponent {
  sortCriteria = model.required<Option<SortCriteria<EvaluationSortKey>>>();
  selectedColumn = input.required<number>();
  columns = input.required<ReadonlyArray<EvaluationColumn>>();
  entries = input.required<ReadonlyArray<EvaluationEntry>>();
  hasGrades = input.required<boolean>();
  subscriptionDetailChange = output<EvaluationSubscriptionDetail>();

  gradeColumnSelected = computed(
    () => this.selectedColumn() === GRADE_COLUMN_KEY,
  );
  gradesAverage = computed(() => this.getGradesAverage(this.entries()));
  totalColumns = computed(
    () =>
      1 + // Name
      (this.hasGrades() ? 1 : 0) + // Grade
      this.columns().length, // Subscription details
  );

  private criteriaVisibilities = linkedSignal<
    ReadonlyArray<EvaluationEntry>,
    Dict<WritableSignal<boolean>>
  >({
    source: this.entries,
    computation: (entries, previous) =>
      entries.reduce((acc, entry) => {
        // Keep the previous visibility state by re-using the existing signal of
        // any given grading item, if it exists
        const visible =
          (previous?.value && previous.value[entry.gradingItem.Id]) ||
          signal(false);
        return { ...acc, [entry.gradingItem.Id]: visible };
      }, {}),
  });

  private sticky = viewChild(TableHeaderStickyDirective);

  constructor() {
    effect(() => {
      // Refresh the column widths of the sticky header, whenever columns are
      // rendered
      this.columns();
      this.sticky()?.refresh();
    });
  }

  isColumnSelected(
    column: Option<EvaluationColumn | EvaluationSubscriptionDetail>,
  ) {
    if (!column) return false;
    return this.getColumnKey(column) === this.selectedColumn();
  }

  getDetailValue(
    detail: Option<EvaluationSubscriptionDetail>,
  ): WritableSignal<SubscriptionDetail["Value"]> {
    if (!detail) return signal(null);
    return detail.value ?? signal(null);
  }

  isCriteriaVisible(entry: EvaluationEntry): WritableSignal<boolean> {
    return this.criteriaVisibilities()[entry.gradingItem.Id] ?? signal(false);
  }

  toggleCriteria(entry: EvaluationEntry): void {
    this.criteriaVisibilities()[entry.gradingItem.Id]?.update((v) => !v);
  }

  onRowClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Toggle the criteria, if the user clicks the empty space within a cell
    if (target.tagName === "TD") {
      target
        .closest("tr")
        ?.querySelector<HTMLButtonElement>("button.criteria-toggle")
        ?.click();
    }
  }

  private getColumnKey(
    column: EvaluationColumn | EvaluationSubscriptionDetail,
  ) {
    return "detail" in column ? column.detail.VssId : column.vssId;
  }

  private getGradesAverage(entries: ReadonlyArray<EvaluationEntry>): number {
    const grades = entries
      .map(({ grade }) => grade?.Value)
      .filter((v): v is number => v != null && v !== 0);
    return average(grades);
  }
}
