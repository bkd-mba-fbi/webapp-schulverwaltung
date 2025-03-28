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
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { EvaluationSortKey } from "../../../services/evaluation-state.service";
import { TableHeaderStickyDirective } from "../../common/table-header-sticky/table-header-sticky.directive";
import {
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
  ],
  templateUrl: "./evaluation-table.component.html",
  styleUrl: "./evaluation-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationTableComponent {
  sortCriteria = model.required<Option<SortCriteria<EvaluationSortKey>>>();
  selectedColumn = input.required<number>();
  gradingItems = input.required<ReadonlyArray<GradingItem>>();
  isStudyClass = input.required<boolean>();

  gradeColumnSelected = computed(
    () => this.selectedColumn() === GRADE_COLUMN_KEY,
  );
  absencesColumnSelected = computed(
    () => this.selectedColumn() === ABSENCES_COLUMN_KEY,
  );
}
