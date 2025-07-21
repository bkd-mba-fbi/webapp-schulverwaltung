import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { distinctUntilChanged, map, startWith, switchMap } from "rxjs";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { Status } from "src/app/shared/models/status.model";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StatusProcessesRestService } from "src/app/shared/services/status-processes-rest.service";

@Component({
  selector: "bkd-events-students-study-course-edit-dialog",
  imports: [FormsModule, TranslatePipe, SpinnerComponent],
  templateUrl: "./events-students-study-course-edit-dialog.component.html",
  styleUrl: "./events-students-study-course-edit-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsStudentsStudyCourseEditDialogComponent {
  private updateService = inject(StatusProcessesRestService);
  private loadingService = inject(LoadingService);
  activeModal = inject(NgbActiveModal);

  currentStatus = input.required<Status>();
  subscriptionId = input.required<number>();
  personId = input.required<number>();

  loading = toSignal(this.loadingService.loading$, { initialValue: true });

  statusId = computed(() => this.currentStatus().IdStatus);

  statusList = toSignal(
    toObservable(this.statusId).pipe(
      distinctUntilChanged(),
      switchMap((statusId) => this.updateService.getStatusList(statusId)),
      map((statusList) => {
        statusList = [...statusList, this.currentStatus()];
        return statusList.sort((a, b) => a.Status.localeCompare(b.Status));
      }),
      startWith([]),
    ),
  );
  canUpdate = computed(() =>
    this.selected().IdStatus
      ? this.selected().IdStatus !== this.statusId()
      : false,
  );

  selected = signal<Status>({} as Status);

  updateStatus(): void {
    this.updateService
      .updateStatus(
        "PersonenAnmeldung",
        this.subscriptionId(),
        this.personId(),
        this.selected().IdStatus,
      )
      .subscribe(() => this.activeModal.close());
  }

  onSelectionChange(option: Status): void {
    this.selected.set(option);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
