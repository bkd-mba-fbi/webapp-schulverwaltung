import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { PAGE_LOADING_CONTEXT } from "src/app/shared/services/paginated-entries.service";
import { StatusProcessesRestService } from "src/app/shared/services/status-processes-rest.service";
import { EventSummary } from "../../../../shared/models/event.model";

@Component({
  selector: "bkd-evaluation-finalise-dialog",
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: "./evaluation-finalise-dialog.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationFinaliseDialogComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  private eventsService = inject(EventsRestService);
  private loadingService = inject(LoadingService);
  private evaluationStatusService = inject(StatusProcessesRestService);

  eventId: number | null = null;
  eventSummary = signal<EventSummary | null>(null);
  isModuleEvent = signal(false);
  hasOpenEvaluations = false;
  loading = toSignal(this.loadingService.loading(PAGE_LOADING_CONTEXT), {
    initialValue: true,
  });

  private readonly MODULE_EVENT_TYPE_ID = 3;

  ngOnInit(): void {
    if (this.eventId) {
      this.loadEventSummary(this.eventId).subscribe({
        next: (eventSummary) => {
          if (eventSummary) {
            this.eventSummary.set(eventSummary);
            const isModule =
              eventSummary.EventTypeId === this.MODULE_EVENT_TYPE_ID;
            this.isModuleEvent.set(isModule);
          }
        },
        error: (error) => {
          console.error("Error loading event summary:", error);
        },
      });
    }
  }

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
      console.error("No event selected");
      this.activeModal.close(false);
      return;
    }

    try {
      const success = await this.evaluationStatusService.forwardStatus(
        event.StatusId,
      );
      this.activeModal.close(success);
    } catch (error) {
      console.error("Error updating module event status", error);
      this.activeModal.close(false);
    }
  }
}
