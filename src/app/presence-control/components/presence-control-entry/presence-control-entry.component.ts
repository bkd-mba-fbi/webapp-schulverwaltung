import { AsyncPipe } from "@angular/common";
import {
  Component,
  HostBinding,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Params, RouterLink } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { combineLatest, map, switchMap } from "rxjs";
import { PresenceControlViewMode } from "src/app/shared/models/user-settings.model";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { getEntryUpdateContext } from "src/app/shared/services/lesson-presences-update.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { AvatarComponent } from "../../../shared/components/avatar/avatar.component";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { ToastService } from "../../../shared/services/toast.service";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";
import { getBlockLessonLoadingContext } from "../../services/presence-control-block-lesson.service";
import { PresenceControlPrecedingAbsenceComponent } from "../presence-control-preceding-absence/presence-control-preceding-absence.component";

@Component({
  selector: "bkd-presence-control-entry",
  templateUrl: "./presence-control-entry.component.html",
  styleUrls: ["./presence-control-entry.component.scss"],
  imports: [
    AvatarComponent,
    SpinnerComponent,
    RouterLink,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class PresenceControlEntryComponent {
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private modalService = inject(BkdModalService);
  private loadingService = inject(LoadingService);

  readonly entry = input.required<PresenceControlEntry>();
  readonly hasUnconfirmedAbsences = input(false);
  readonly viewMode = input.required<PresenceControlViewMode>();
  readonly showClassName = input(false);
  readonly profileReturnParams = input<Params>();

  readonly togglePresenceType = output<PresenceControlEntry>();
  readonly changeIncident = output<PresenceControlEntry>();

  studentId = computed(() => this.entry().lessonPresence.StudentRef.Id);
  isListViewMode = computed(
    () => this.viewMode() === PresenceControlViewMode.List,
  );

  @HostBinding("class") get classNames(): string {
    return [this.entry().presenceCategory, this.viewMode].join(" ");
  }

  loading$ = toObservable(this.entry).pipe(
    switchMap((entry) =>
      combineLatest([
        this.loadingService.loading(getEntryUpdateContext(entry)),
        this.loadingService.loading(getBlockLessonLoadingContext(entry)),
      ]).pipe(
        map(([updateLoading, blockLoading]) => updateLoading || blockLoading),
      ),
    ),
  );

  updatePresenceType(entry: PresenceControlEntry): void {
    if (!entry.canChangePresenceType) {
      this.toastService.warning(
        this.translate.instant("presence-control.entry.update-warning"),
      );
    } else {
      this.togglePresenceType.emit(entry);
    }
  }

  updateIncident(entry: PresenceControlEntry): void {
    if (entry.canChangeIncident) {
      this.changeIncident.emit(entry);
    }
  }

  showPrecedingAbsences(entry: PresenceControlEntry): void {
    const modalRef = this.modalService.open(
      PresenceControlPrecedingAbsenceComponent,
    );
    modalRef.componentInstance.precedingAbsences = entry.precedingAbsences;
  }
}
