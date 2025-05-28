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
  columns = input.required<ReadonlyArray<EvaluationColumn>>();
  sortCriteria = model.required<Option<SortCriteria<EvaluationSortKey>>>();
  selectedColumn = input.required<Option<number>>();
  hasGrades = input.required<boolean>();
  showCommentColumn = input(false);

  gradeColumnSelected = computed(
    () => this.selectedColumn() === GRADE_COLUMN_KEY,
  );

  commentColumnSelected = computed(
    () => this.selectedColumn() === COMMENT_COLUMN_KEY,
  );

  isColumnSelected(column: EvaluationColumn) {
    return column.vssId === this.selectedColumn();
  }
}
