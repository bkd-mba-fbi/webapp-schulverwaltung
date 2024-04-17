import { AsyncPipe, NgIf } from "@angular/common";
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ReplaySubject, map, switchMap } from "rxjs";
import { PresenceControlViewMode } from "src/app/shared/models/user-settings.model";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { AvatarComponent } from "../../../shared/components/avatar/avatar.component";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { LetDirective } from "../../../shared/directives/let.directive";
import { ToastService } from "../../../shared/services/toast.service";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";
import { getBlockLessonLoadingContext } from "../../services/presence-control-block-lesson.service";
import { PresenceControlPrecedingAbsenceComponent } from "../presence-control-preceding-absence/presence-control-preceding-absence.component";

@Component({
  selector: "erz-presence-control-entry",
  templateUrl: "./presence-control-entry.component.html",
  styleUrls: ["./presence-control-entry.component.scss"],
  standalone: true,
  imports: [
    NgIf,
    AvatarComponent,
    LetDirective,
    SpinnerComponent,
    RouterLink,
    AsyncPipe,
    TranslateModule,
  ],
})
export class PresenceControlEntryComponent implements OnChanges {
  @Input() entry: PresenceControlEntry;
  @Input() hasUnconfirmedAbsences = false;
  @Input() viewMode: PresenceControlViewMode;
  @Input() showClassName = false;
  @Input() profileReturnParams?: Params;

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

  constructor(
    private toastService: ToastService,
    private translate: TranslateService,
    private modalService: BkdModalService,
    private loadingService: LoadingService,
  ) {}

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
