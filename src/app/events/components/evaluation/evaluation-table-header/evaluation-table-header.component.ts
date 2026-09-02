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
import { COMMENT_COLUMN_KEY, GRADE_COLUMN_KEY } from "../evaluation-constants";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "thead[bkdEvaluationTableHeader]",
  imports: [TranslatePipe, SortableHeaderComponent],
  templateUrl: "./evaluation-table-header.component.html",
  styleUrl: "./evaluation-table-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationTableHeaderComponent extends TableHeaderComponent {
  readonly columns = input.required<ReadonlyArray<EvaluationColumn>>();
  readonly sortCriteria =
    model.required<Option<SortCriteria<EvaluationSortKey>>>();
  readonly selectedColumn = input.required<Option<number>>();
  readonly hasGrades = input.required<boolean>();
  readonly hasGradeComments = input(false);

  protected readonly gradeColumnSelected = computed(
    () => this.selectedColumn() === GRADE_COLUMN_KEY,
  );

  protected readonly commentColumnSelected = computed(
    () => this.selectedColumn() === COMMENT_COLUMN_KEY,
  );

  protected isColumnSelected(column: EvaluationColumn) {
    return column.vssId === this.selectedColumn();
  }
}
