import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { Observable, switchMap } from "rxjs";
import { of } from "rxjs";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { PAGE_LOADING_CONTEXT } from "src/app/shared/services/paginated-entries.service";
import { StatusProcessesRestService } from "src/app/shared/services/status-processes-rest.service";
import { EventSummary } from "../../../../shared/models/event.model";

const MODULE_EVENT_TYPE_ID = 3;

@Component({
  selector: "bkd-evaluation-finalise-dialog",
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: "./evaluation-finalise-dialog.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationFinaliseDialogComponent {
  activeModal = inject(NgbActiveModal);
  private eventsService = inject(EventsRestService);
  private loadingService = inject(LoadingService);
  private evaluationStatusService = inject(StatusProcessesRestService);

  eventId = signal<Option<number>>(null);
  hasOpenEvaluations = signal<boolean>(false);

  loading = toSignal(this.loadingService.loading(PAGE_LOADING_CONTEXT), {
    initialValue: true,
  });

  eventSummary = toSignal(
    toObservable(this.eventId).pipe(
      switchMap((eventId) =>
        eventId ? this.loadEventSummary(eventId) : of(null),
      ),
    ),
    { initialValue: null as Option<EventSummary> },
  );

  isModuleEvent = computed(
    () => this.eventSummary()?.EventTypeId === MODULE_EVENT_TYPE_ID,
  );

  private loadEventSummary(eventId: number): Observable<Option<EventSummary>> {
    return this.loadingService.load(
      this.eventsService.getEventSummary(eventId),
      PAGE_LOADING_CONTEXT,
    );
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  async confirm(): Promise<void> {
    if (this.isModuleEvent()) {
      await this.updateModuleEventStatus();
    } else {
      this.activeModal.close(true);
    }
  }

  private async updateModuleEventStatus(): Promise<void> {
    const event = this.eventSummary();
    if (!event) {
      // Should not happen
      throw new Error("No event available");
    }

    try {
      await this.evaluationStatusService.forwardStatus(
        event.StatusId,
        event.Id,
      );
      this.activeModal.close(true);
    } catch (error) {
      console.error("Error updating module event status", error);
      this.activeModal.close(false);
    }
  }
}
