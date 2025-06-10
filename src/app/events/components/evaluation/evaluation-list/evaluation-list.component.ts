import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
} from "@angular/core";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import uniqBy from "lodash-es/uniqBy";
import { EvaluationSubscriptionDetailUpdateService } from "src/app/events/services/evaluation-subscription-detail-update.service";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { notNull } from "src/app/shared/utils/filter";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { BkdModalService } from "../../../../shared/services/bkd-modal.service";
import { EvaluationGradingItemUpdateService } from "../../../services/evaluation-grading-item-update.service";
import {
  EvaluationStateService,
  EvaluationSubscriptionDetail,
} from "../../../services/evaluation-state.service";
import { COMMENT_COLUMN_KEY, GRADE_COLUMN_KEY } from "../evaluation-constants";
import { EvaluationDefaultGradeDialogComponent } from "../evaluation-dialog/evaluation-default-grade-dialog.component";
import { EvaluationHeaderComponent } from "../evaluation-header/evaluation-header.component";
import { EvaluationTableComponent } from "../evaluation-table/evaluation-table.component";

@Component({
  selector: "bkd-evaluation-list",
  imports: [
    TranslatePipe,
    EvaluationHeaderComponent,
    EvaluationTableComponent,
    SpinnerComponent,
    SelectComponent,
    NgClass,
  ],
  templateUrl: "./evaluation-list.component.html",
  styleUrl: "./evaluation-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationListComponent {
  state = inject(EvaluationStateService);
  private updateDefaultGradeService = inject(
    EvaluationGradingItemUpdateService,
  );
  private updateSubscriptionDetailService = inject(
    EvaluationSubscriptionDetailUpdateService,
  );
  private translate = inject(TranslateService);
  private modalService = inject(BkdModalService);

  readonly GRADE_COLUMN = GRADE_COLUMN_KEY;

  hasGrades = computed(() => this.state.gradingScale() !== null);
  hasGradeComments = computed(
    () => this.state.gradingScale()?.CommentsAllowed === true,
  );
  columnOptions = computed<ReadonlyArray<DropDownItem>>(() => {
    const gradeOption: DropDownItem = {
      Key: GRADE_COLUMN_KEY,
      Value: this.translate.instant("evaluation.columns.grade"),
    };

    const commentOption: DropDownItem = {
      Key: COMMENT_COLUMN_KEY,
      Value: this.translate.instant("evaluation.columns.comment"),
    };

    const subscriptionDetailOptions: ReadonlyArray<DropDownItem> = uniqBy(
      this.state
        .columns()
        .map(({ vssId, title }) => ({ Key: vssId, Value: title })),
      (option) => option.Key,
    );

    return [
      this.hasGrades() ? gradeOption : null,
      ...subscriptionDetailOptions,
      this.hasGradeComments() ? commentOption : null,
    ].filter(notNull);
  });

  selectedColumn = linkedSignal<ReadonlyArray<DropDownItem>, Option<number>>({
    source: this.columnOptions,
    computation: (options, previous) => {
      const previousValue = previous?.value;
      if (previousValue && options.find((o) => o.Key === previousValue)) {
        // Don't reset the previously selected column, if it's still available
        // when recomputing
        return previousValue;
      }

      return options.length > 0 ? Number(options[0].Key) : null;
    },
  });

  openDefaultGradeDialog() {
    const modalRef = this.modalService.open(
      EvaluationDefaultGradeDialogComponent,
    );
    modalRef.componentInstance.gradingScale = this.state.gradingScale;
    modalRef.componentInstance.updateService = this.updateDefaultGradeService;
    modalRef.result.then(
      () => {},
      () => {},
    );
  }

  updateSubscriptionDetail(detail: EvaluationSubscriptionDetail): void {
    void this.updateSubscriptionDetailService.updateSubscriptionDetail(detail);
  }
}
