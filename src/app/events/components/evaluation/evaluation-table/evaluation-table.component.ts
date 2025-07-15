import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { average } from "src/app/shared/utils/math";
import { GradingItemCommentTextareaComponent } from "../../../../shared/components/grading-item/grading-item-comment-textarea.component";
import { SubscriptionDetailFieldComponent } from "../../../../shared/components/subscription-detail-field/subscription-detail-field.component";
import { GradingScale } from "../../../../shared/models/grading-scale.model";
import { DecimalOrDashPipe } from "../../../../shared/pipes/decimal-or-dash.pipe";
import { BkdModalService } from "../../../../shared/services/bkd-modal.service";
import { EvaluationGradingItemUpdateService } from "../../../services/evaluation-grading-item-update.service";
import {
  EvaluationColumn,
  EvaluationEntry,
  EvaluationSortKey,
  EvaluationStateService,
  EvaluationSubscriptionDetail,
} from "../../../services/evaluation-state.service";
import { EvaluationSubscriptionDetailUpdateService } from "../../../services/evaluation-subscription-detail-update.service";
import { TableHeaderStickyDirective } from "../../common/table-header-sticky/table-header-sticky.directive";
import { COMMENT_COLUMN_KEY, GRADE_COLUMN_KEY } from "../evaluation-constants";
import { EvaluationCriteriaComponent } from "../evaluation-criteria/evaluation-criteria.component";
import { EvaluationFinaliseDialogComponent } from "../evaluation-finalise-dialog/evaluation-finalise-dialog.component";
import { EvaluationGradeComponent } from "../evaluation-grade/evaluation-grade.component";
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
    EvaluationGradeComponent,
    GradingItemCommentTextareaComponent,
  ],
  templateUrl: "./evaluation-table.component.html",
  styleUrl: "./evaluation-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationTableComponent {
  state = inject(EvaluationStateService);
  gradingItemUpdateService = inject(EvaluationGradingItemUpdateService);
  private subscriptionDetailUpdateService = inject(
    EvaluationSubscriptionDetailUpdateService,
  );
  private modalService = inject(BkdModalService);
  private router = inject(Router);

  sortCriteria = model.required<Option<SortCriteria<EvaluationSortKey>>>();
  selectedColumn = input.required<number>();
  columns = input.required<ReadonlyArray<EvaluationColumn>>();
  entries = input.required<ReadonlyArray<EvaluationEntry>>();
  hasGrades = input.required<boolean>();
  hasGradeComments = input.required<boolean>();
  subscriptionDetailChange = output<EvaluationSubscriptionDetail>();
  gradingScale = input.required<GradingScale>();

  gradeColumnSelected = computed(
    () => this.selectedColumn() === GRADE_COLUMN_KEY,
  );
  commentColumnSelected = computed(
    () => this.selectedColumn() === COMMENT_COLUMN_KEY,
  );
  gradesAverage = computed(() => this.getGradesAverage(this.entries()));
  totalColumns = computed(
    () =>
      1 + // Name
      (this.hasGrades() ? 1 : 0) + // Grade
      (this.hasGradeComments() ? 1 : 0) + // Comment
      this.columns().length, // Subscription details
  );

  hasPendingRequests = computed(
    () =>
      this.gradingItemUpdateService.updating() ||
      this.subscriptionDetailUpdateService.updating(),
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

  gradeOptions = computed(() =>
    this.gradingScale()?.Grades.map((grade) => ({
      Key: grade.Id,
      Value: grade.Designation,
    })),
  );

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

  updateGrade(gradeId: Option<number>, gradingItemId: string) {
    this.gradingItemUpdateService.updateGrade(gradingItemId, gradeId);
  }

  updateComment(comment: Option<string>, gradingItemId: string) {
    this.gradingItemUpdateService.updateComment(gradingItemId, comment);
  }

  openFinaliseEvaluationDialog(): void {
    const modalRef = this.modalService.open(EvaluationFinaliseDialogComponent);
    const component =
      modalRef.componentInstance as EvaluationFinaliseDialogComponent;

    component.eventId.set(this.state.event()?.id ?? null);

    const hasOpenEvaluations = this.entries().some(
      (entry) => entry.evaluationRequired,
    );
    component.hasOpenEvaluations.set(hasOpenEvaluations);

    modalRef.result.then(
      async (result) => {
        if (result) {
          await this.router.navigate(["events"]);
        }
      },
      () => {},
    );
  }
}
