import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import {
  SortCriteria,
  SortableHeaderComponent,
} from "src/app/shared/components/sortable-header/sortable-header.component";
import {
  EvaluationColumn,
  EvaluationSortKey,
} from "../../../services/evaluation-state.service";
import { TableHeaderComponent } from "../../common/table-header/table-header.component";
import {
  ABSENCES_COLUMNS_VSS_IDS,
  ABSENCES_COLUMN_KEY,
  GRADE_COLUMN_KEY,
} from "../evaluation-list/evaluation-list.component";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "thead[bkdEvaluationTableHeader]",
  imports: [TranslatePipe, SortableHeaderComponent],
  templateUrl: "./evaluation-table-header.component.html",
  styleUrl: "./evaluation-table-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationTableHeaderComponent extends TableHeaderComponent {
  columns = input.required<ReadonlyArray<EvaluationColumn>>();
  sortCriteria = model.required<Option<SortCriteria<EvaluationSortKey>>>();
  selectedColumn = input.required<Option<number>>();
  hasGrades = input.required<boolean>();

  gradeColumnSelected = computed(
    () => this.selectedColumn() === GRADE_COLUMN_KEY,
  );

  isColumnSelected(column: EvaluationColumn) {
    return this.getColumnKey(column) === this.selectedColumn();
  }

  isAbsencesColumn(column: EvaluationColumn) {
    return this.getColumnKey(column) === ABSENCES_COLUMN_KEY;
  }

  private getColumnKey(column: EvaluationColumn) {
    return ABSENCES_COLUMNS_VSS_IDS.includes(column.vssId)
      ? ABSENCES_COLUMN_KEY
      : column.vssId;
  }
}
