import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { notNull } from "src/app/shared/utils/filter";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { EvaluationStateService } from "../../../services/evaluation-state.service";
import { EvaluationHeaderComponent } from "../evaluation-header/evaluation-header.component";
import { EvaluationTableComponent } from "../evaluation-table/evaluation-table.component";

export const GRADE_COLUMN_KEY = -1;
export const ABSENCES_COLUMN_KEY = -2;

@Component({
  selector: "bkd-evaluation-list",
  imports: [
    TranslatePipe,
    EvaluationHeaderComponent,
    EvaluationTableComponent,
    SpinnerComponent,
    SelectComponent,
  ],
  templateUrl: "./evaluation-list.component.html",
  styleUrl: "./evaluation-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationListComponent {
  state = inject(EvaluationStateService);
  private translate = inject(TranslateService);

  columns = computed<ReadonlyArray<DropDownItem>>(() => {
    const gradeOption: DropDownItem = {
      Key: GRADE_COLUMN_KEY,
      Value: this.translate.instant("evaluation.columns.grade"),
    };
    const absencesOption: DropDownItem = {
      Key: ABSENCES_COLUMN_KEY,
      Value: this.translate.instant("evaluation.columns.absences"),
    };

    // TODO: include subscription detail columns but replace ID 3710 (Absenzen
    // entschuldigt) and ID 3720 (Absenzen unentschuldigt) with the
    // absencesOption
    const subscriptionDetailOptions: ReadonlyArray<DropDownItem> = [
      { Key: 1, Value: "Anforderungen" },
      // { Key: 3710, Value: "Absenzen entschuldigt" },
      // { Key: 3720, Value: "Absenzen unentschuldigt" },
      absencesOption,
      { Key: 4, Value: "Formative Beurteilung (generell)" },
      { Key: 5, Value: "Bemerkung" },
    ];

    return [
      this.state.isStudyClass() ? null : gradeOption,
      ...subscriptionDetailOptions,
    ].filter(notNull);
  });
  selectedColumn = computed(() => {
    const columns = this.columns();
    const initialValue = columns.length ? Number(columns[0].Key) : null;
    return signal<Option<number>>(initialValue);
  });
}
