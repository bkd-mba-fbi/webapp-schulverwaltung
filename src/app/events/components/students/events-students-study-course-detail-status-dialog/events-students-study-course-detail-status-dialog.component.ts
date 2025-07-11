import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { StatusProcessesRestService } from "src/app/shared/services/status-processes-rest.service";

@Component({
  selector: "bkd-events-students-study-course-detail-status-dialog",
  imports: [FormsModule, TranslatePipe],
  templateUrl:
    "./events-students-study-course-detail-status-dialog.component.html",
  styleUrl:
    "./events-students-study-course-detail-status-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsStudentsStudyCourseDetailStatusDialogComponent {
  activeModal = inject(NgbActiveModal);
  updateService = inject(StatusProcessesRestService);

  subscriptionId = input<number>(0);
  personId = input<number>(0);
  statusId = input<number>(0);

  statuses = [
    { id: 1, label: "Abgelehnt" },
    { id: 2, label: "Angemeldet" },
    { id: 3, label: "Aufgenommen" },
    { id: 4, label: "In Prüfung" },
    { id: 5, label: "Sistiert" },
  ];
  selected = computed(() => {
    return this.statuses.find((status) => status.id === 2);
  });

  // status = computed(() => this.updateService.getStatuses);

  updateStatus(): void {
    this.activeModal.close();
    // const selectedStatus = this.selectedStatus();
    // if (selectedStatus) {
    //   await this.updateService
    //     .updateStatus(selectedStatus.Id)
    //     .then(() => this.activeModal.close());
    // }
  }

  onSelectionChange(): void {
    // this.selected = option;
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
