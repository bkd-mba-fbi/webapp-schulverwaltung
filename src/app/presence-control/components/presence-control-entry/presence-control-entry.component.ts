import { AsyncPipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  input,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { ReplaySubject, map, switchMap } from "rxjs";
import { PresenceControlViewMode } from "src/app/shared/models/user-settings.model";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
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
export class PresenceControlEntryComponent implements OnChanges {
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private modalService = inject(BkdModalService);
  private loadingService = inject(LoadingService);

  @Input() entry: PresenceControlEntry;
  readonly hasUnconfirmedAbsences = input(false);
  @Input() viewMode: PresenceControlViewMode;
  @Input() showClassName = false;
  readonly profileReturnParams = input<Params>();

  @Output() togglePresenceType = new EventEmitter<PresenceControlEntry>();
  @Output() changeIncident = new EventEmitter<PresenceControlEntry>();

  @HostBinding("class") get classNames(): string {
    return [this.entry.presenceCategory, this.viewMode].join(" ");
  }

  entry$ = new ReplaySubject<PresenceControlEntry>(1);
  studentId$ = this.entry$.pipe(
    map(({ lessonPresence }) => lessonPresence.StudentRef.Id),
  );
  loading$ = this.entry$.pipe(
    switchMap((entry) =>
      this.loadingService.loading(getBlockLessonLoadingContext(entry)),
    ),
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["entry"]) {
      this.entry$.next(changes["entry"].currentValue);
    }
  }

  get isListViewMode(): boolean {
    return this.viewMode === PresenceControlViewMode.List;
  }

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
