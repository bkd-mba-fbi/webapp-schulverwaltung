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

  eventId: number | null = null;
  isModuleEvent = signal(false);
  loading = toSignal(this.loadingService.loading(PAGE_LOADING_CONTEXT), {
    initialValue: true,
  });

  ngOnInit(): void {
    if (this.eventId) {
      this.loadEventSummary(this.eventId).subscribe({
        next: (eventSummary) => {
          const isModule = eventSummary?.EventTypeId === 3;
          this.isModuleEvent.set(isModule);
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

  confirm(): void {
    this.activeModal.close();
  }
}
