import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { EvaluationSortKey } from "../../services/evaluation-state.service";
import { EvaluationTableHeaderComponent } from "../evaluation-table-header/evaluation-table-header.component";
import { TableHeaderStickyDirective } from "../table-header-sticky/table-header-sticky.directive";

@Component({
  selector: "bkd-evaluation-list-table",
  imports: [
    RouterLink,
    NgClass,
    TranslatePipe,
    EvaluationTableHeaderComponent,
    TableHeaderStickyDirective,
  ],
  templateUrl: "./evaluation-list-table.component.html",
  styleUrl: "./evaluation-list-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationListTableComponent {
  sortCriteria = model.required<Option<SortCriteria<EvaluationSortKey>>>();
  gradingItems = input.required<ReadonlyArray<GradingItem>>();
  selectedColumn = input.required<Option<"absences" | number>>();
}
