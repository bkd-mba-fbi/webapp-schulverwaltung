import { AsyncPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { flatten, uniq } from "lodash-es";
import { map } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { LessonPresencesUpdateRestService } from "src/app/shared/services/lesson-presences-update-rest.service";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { LetDirective } from "../../../shared/directives/let.directive";
import { AddSpacePipe } from "../../../shared/pipes/add-space.pipe";
import { ToastService } from "../../../shared/services/toast.service";
import { MyAbsencesService } from "../../services/my-absences.service";
import { MyAbsencesAbstractConfirmComponent } from "./my-absences-abstract-confirm.component";

@Component({
  selector: "bkd-my-absences-confirm",
  templateUrl: "./my-absences-abstract-confirm.component.html",
  styleUrls: ["./my-absences-abstract-confirm.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LetDirective,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgClass,
    NgIf,
    AsyncPipe,
    TranslateModule,
    AddSpacePipe,
  ],
})
export class MyAbsencesConfirmComponent extends MyAbsencesAbstractConfirmComponent {
  titleKey = "my-absences.confirm.title";
  selectedLessonIds$ = this.selectionService.selectedIds$.pipe(
    map((selectedIds) => uniq(flatten(selectedIds.map((s) => s.lessonIds)))),
  );
  protected confirmationStateId = this.settings.unconfirmedAbsencesRefreshTime;

  constructor(
    fb: UntypedFormBuilder,
    router: Router,
    toastService: ToastService,
    translate: TranslateService,
    presenceTypesService: PresenceTypesService,
    updateService: LessonPresencesUpdateRestService,
    storageService: StorageService,
    @Inject(SETTINGS) settings: Settings,
    private myAbsencesService: MyAbsencesService,
    private selectionService: ConfirmAbsencesSelectionService,
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

  protected override onSaveSuccess(): void {
    this.selectionService.clear();
    this.myAbsencesService.reset();
    super.onSaveSuccess();
  }

  protected navigateBack(): void {
    this.router.navigate(["/my-absences"]);
  }
}
