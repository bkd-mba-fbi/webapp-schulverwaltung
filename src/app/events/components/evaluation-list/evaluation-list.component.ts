import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { EvaluationStateService } from "../../services/evaluation-state.service";
import { EvaluationHeaderComponent } from "../evaluation-header/evaluation-header.component";
import { EvaluationListTableComponent } from "../evaluation-list-table/evaluation-list-table.component";

@Component({
  selector: "bkd-evaluation-list",
  imports: [
    TranslatePipe,
    EvaluationHeaderComponent,
    EvaluationListTableComponent,
  ],
  templateUrl: "./evaluation-list.component.html",
  styleUrl: "./evaluation-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationListComponent {
  state = inject(EvaluationStateService);

  selectedColumn = signal<Option<"absences" | number>>(null);
}
