import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { flatten, uniq } from "lodash-es";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { LessonPresencesUpdateRestService } from "src/app/shared/services/lesson-presences-update-rest.service";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { ToastService } from "../../../shared/services/toast.service";
import { MyAbsencesReportSelectionService } from "../../services/my-absences-report-selection.service";
import { MyAbsencesReportStateService } from "../../services/my-absences-report-state.service";
import { MyAbsencesAbstractConfirmComponent } from "./my-absences-abstract-confirm.component";

@Component({
  selector: "erz-my-absences-confirm",
  templateUrl: "./my-absences-abstract-confirm.component.html",
  styleUrls: ["./my-absences-abstract-confirm.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAbsencesReportConfirmComponent extends MyAbsencesAbstractConfirmComponent {
  titleKey = "my-absences.report.title";
  selectedLessonIds$ = this.selectionService.selectedIds$.pipe(
    map((selectedIds) => uniq(flatten(selectedIds.map((s) => s.lessonIds)))),
  );
  protected confirmationStateId = this.settings.checkableAbsenceStateId;

  constructor(
    fb: UntypedFormBuilder,
    router: Router,
    toastService: ToastService,
    translate: TranslateService,
    presenceTypesService: PresenceTypesService,
    updateService: LessonPresencesUpdateRestService,
    storageService: StorageService,
    @Inject(SETTINGS) settings: Settings,
    private state: MyAbsencesReportStateService,
    private selectionService: MyAbsencesReportSelectionService,
  ) {
    super(
      fb,
      router,
      toastService,
      translate,
      presenceTypesService,
      updateService,
      storageService,
      settings,
    );
  }

  protected getHalfDayType(): Observable<Option<PresenceType>> {
    return this.presenceTypesService
      .getPresenceType(this.settings.halfDayPresenceTypeId)
      .pipe(map((t) => (t.Active ? t : null)));
  }

  protected onSaveSuccess(): void {
    this.selectionService.clear();
    this.state.resetEntries();
    super.onSaveSuccess();
  }

  protected navigateBack(): void {
    this.state.queryParams$.pipe(take(1)).subscribe((queryParams) => {
      this.router.navigate(["/my-absences/report"], {
        queryParams,
      });
    });
  }
}
