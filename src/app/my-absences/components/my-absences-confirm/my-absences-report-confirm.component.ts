import { AsyncPipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from "@angular/forms";
import { Router } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { flatten, uniq } from "lodash-es";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { LessonPresencesUpdateRestService } from "src/app/shared/services/lesson-presences-update-rest.service";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { AddSpacePipe } from "../../../shared/pipes/add-space.pipe";
import { ToastService } from "../../../shared/services/toast.service";
import { MyAbsencesReportSelectionService } from "../../services/my-absences-report-selection.service";
import { MyAbsencesReportStateService } from "../../services/my-absences-report-state.service";
import { MyAbsencesAbstractConfirmComponent } from "./my-absences-abstract-confirm.component";

@Component({
  selector: "bkd-my-absences-confirm",
  templateUrl: "./my-absences-abstract-confirm.component.html",
  styleUrls: ["./my-absences-abstract-confirm.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    AsyncPipe,
    TranslatePipe,
    AddSpacePipe,
  ],
})
export class MyAbsencesReportConfirmComponent extends MyAbsencesAbstractConfirmComponent {
  private state = inject(MyAbsencesReportStateService);
  private selectionService = inject(MyAbsencesReportSelectionService);

  titleKey = "my-absences.report.title";
  selectedLessonIds$ = this.selectionService.selectedIds$.pipe(
    map((selectedIds) => uniq(flatten(selectedIds.map((s) => s.lessonIds)))),
  );
  protected confirmationStateId = this.settings.checkableAbsenceStateId;

  constructor() {
    const fb = inject(UntypedFormBuilder);
    const router = inject(Router);
    const toastService = inject(ToastService);
    const translate = inject(TranslateService);
    const presenceTypesService = inject(PresenceTypesService);
    const updateService = inject(LessonPresencesUpdateRestService);
    const storageService = inject(StorageService);
    const settings = inject<Settings>(SETTINGS);

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

  protected override getHalfDayType(): Observable<Option<PresenceType>> {
    return this.presenceTypesService
      .getPresenceType(this.settings.halfDayPresenceTypeId)
      .pipe(map((t) => (t.Active ? t : null)));
  }

  protected override onSaveSuccess(): void {
    this.selectionService.clear();
    this.state.resetEntries();
    super.onSaveSuccess();
  }

  protected navigateBack(): void {
    this.state.queryParams$.pipe(take(1)).subscribe((queryParams) => {
      void this.router.navigate(["/my-absences/report"], {
        queryParams,
      });
    });
  }
}
