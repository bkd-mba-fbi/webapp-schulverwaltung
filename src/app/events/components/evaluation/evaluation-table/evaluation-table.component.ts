import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
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
  EvaluationEventType,
  EvaluationSortKey,
} from "../../../services/evaluation-state.service";
import { TableHeaderStickyDirective } from "../../common/table-header-sticky/table-header-sticky.directive";
import {
  ABSENCES_COLUMNS_VSS_IDS,
  ABSENCES_COLUMN_KEY,
  GRADE_COLUMN_KEY,
} from "../evaluation-list/evaluation-list.component";
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
  eventType = input.required<EvaluationEventType>();

  gradeColumnSelected = computed(
    () => this.selectedColumn() === GRADE_COLUMN_KEY,
  );
  gradesAverage = computed(() => this.getGradesAverage(this.entries()));

  isColumnSelected(column: Option<EvaluationColumn | SubscriptionDetail>) {
    if (!column) return false;

    return this.getColumnKey(column) === this.selectedColumn();
  }

  private getColumnKey(column: EvaluationColumn | SubscriptionDetail) {
    const id = "VssId" in column ? column.VssId : column.vssId;
    return ABSENCES_COLUMNS_VSS_IDS.includes(id) ? ABSENCES_COLUMN_KEY : id;
  }

  private getGradesAverage(entries: ReadonlyArray<EvaluationEntry>): number {
    const grades = entries
      .map(({ grade }) => grade?.Value)
      .filter((v): v is number => v != null && v !== 0);
    return average(grades);
  }
}
