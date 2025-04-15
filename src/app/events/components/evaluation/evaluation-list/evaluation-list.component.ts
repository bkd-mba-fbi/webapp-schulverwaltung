import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import uniqBy from "lodash-es/uniqBy";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { notNull } from "src/app/shared/utils/filter";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { BkdModalService } from "../../../../shared/services/bkd-modal.service";
import { EvaluationStateService } from "../../../services/evaluation-state.service";
import { EvaluationDefaultGradeDialogComponent } from "../evaluation-dialog/evaluation-default-grade-dialog.component";
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
  private translate = inject(TranslateService);
  private modalService = inject(BkdModalService);

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

  openDefaultGradeDialog() {
    const modalRef = this.modalService.open(
      EvaluationDefaultGradeDialogComponent,
    );
    modalRef.componentInstance.gradingScale = this.state.gradingScale;
    modalRef.componentInstance.gradingItems = this.state.gradingItems;
    modalRef.componentInstance.event = this.state.event;
    modalRef.result.then(
      () => {},
      () => {},
    );
  }
}
