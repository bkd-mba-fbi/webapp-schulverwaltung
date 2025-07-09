import { AsyncPipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { flatten, uniq } from "lodash-es";
import { map } from "rxjs/operators";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { AddSpacePipe } from "../../../shared/pipes/add-space.pipe";
import { MyAbsencesService } from "../../services/my-absences.service";
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
export class MyAbsencesConfirmComponent extends MyAbsencesAbstractConfirmComponent {
  private myAbsencesService = inject(MyAbsencesService);
  private selectionService = inject(ConfirmAbsencesSelectionService);

  titleKey = "my-absences.confirm.title";
  selectedLessonIds$ = this.selectionService.selectedIds$.pipe(
    map((selectedIds) => uniq(flatten(selectedIds.map((s) => s.lessonIds)))),
  );
  protected confirmationStateId = this.settings.unconfirmedAbsencesRefreshTime;

  constructor() {
    super();
  }

  protected override onSaveSuccess(): void {
    this.selectionService.clear();
    this.myAbsencesService.reset();
    super.onSaveSuccess();
  }

  protected navigateBack(): void {
    void this.router.navigate(["/my-absences"]);
  }
}
