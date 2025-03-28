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
import { EvaluationSortKey } from "../../../services/evaluation-state.service";
import { TableHeaderComponent } from "../../common/table-header/table-header.component";
import {
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
  sortCriteria = model.required<Option<SortCriteria<EvaluationSortKey>>>();
  selectedColumn = input.required<Option<number>>();
  isStudyClass = input.required<boolean>();

  gradeColumnSelected = computed(
    () => this.selectedColumn() === GRADE_COLUMN_KEY,
  );
  absencesColumnSelected = computed(
    () => this.selectedColumn() === ABSENCES_COLUMN_KEY,
  );
}
