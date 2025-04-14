import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import uniqBy from "lodash-es/uniqBy";
import { EvaluationUpdateService } from "src/app/events/services/evaluation-update.service";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { notNull } from "src/app/shared/utils/filter";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { EvaluationStateService } from "../../../services/evaluation-state.service";
import { EvaluationHeaderComponent } from "../evaluation-header/evaluation-header.component";
import { EvaluationTableComponent } from "../evaluation-table/evaluation-table.component";

export const GRADE_COLUMN_KEY = -1;
export const ABSENCES_COLUMN_KEY = -2;

export const ABSENCES_COLUMNS_VSS_IDS = [
  3710, // Absenzen entschuldigt
  3720, // Absenzen unentschuldigt
];

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
  update = inject(EvaluationUpdateService);
  private translate = inject(TranslateService);

  columnOptions = computed<ReadonlyArray<DropDownItem>>(() => {
    const gradeOption: DropDownItem = {
      Key: GRADE_COLUMN_KEY,
      Value: this.translate.instant("evaluation.columns.grade"),
    };
    const absencesOption: DropDownItem = {
      Key: ABSENCES_COLUMN_KEY,
      Value: this.translate.instant("evaluation.columns.absences"),
    };
    const subscriptionDetailOptions: ReadonlyArray<DropDownItem> = uniqBy(
      this.state
        .columns()
        .map(({ vssId, title }) =>
          ABSENCES_COLUMNS_VSS_IDS.includes(vssId)
            ? absencesOption
            : { Key: vssId, Value: title },
        ),
      (option) => option.Key,
    );

    return [
      this.state.event()?.type === "course" ? gradeOption : null,
      ...subscriptionDetailOptions,
    ].filter(notNull);
  });

  selectedColumn = computed(() => {
    const options = this.columnOptions();
    const initialValue = options.length ? Number(options[0].Key) : null;
    return signal<Option<number>>(initialValue);
  });

  updateSubscriptionDetail(change: {
    detail: SubscriptionDetail;
    value: SubscriptionDetail["Value"];
  }): void {
    void this.update.updateSubscriptionDetail(change);
  }
}
