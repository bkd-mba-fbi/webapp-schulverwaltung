import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import {
  SortCriteria,
  SortableHeaderComponent,
} from "src/app/shared/components/sortable-header/sortable-header.component";
import { EvaluationSortKey } from "../../services/evaluation-state.service";
import { TableHeaderComponent } from "../table-header/table-header.component";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "thead[bkdEvaluationTableHeader]",
  imports: [NgClass, TranslatePipe, SortableHeaderComponent],
  templateUrl: "./evaluation-table-header.component.html",
  styleUrl: "./evaluation-table-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationTableHeaderComponent extends TableHeaderComponent {
  sortCriteria = model.required<Option<SortCriteria<EvaluationSortKey>>>();
  selectedColumn = input.required<Option<"absences" | number>>();
}
