import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { distinctUntilChanged, map, of, startWith, switchMap } from "rxjs";
import { BacklinkComponent } from "src/app/shared/components/backlink/backlink.component";
import { Event } from "src/app/shared/models/event.model";
import { ReportsService } from "src/app/shared/services/reports.service";
import { toLazySignal } from "src/app/shared/utils/to-lazy-signal";
import { ReportsLinkComponent } from "../../../../shared/components/reports-link/reports-link.component";

@Component({
  selector: "bkd-evaluation-header",
  imports: [BacklinkComponent, TranslatePipe, ReportsLinkComponent],
  templateUrl: "./evaluation-header.component.html",
  styleUrl: "./evaluation-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationHeaderComponent {
  private reportsService = inject(ReportsService);

  event = input.required<Event>();

  reports = toLazySignal(
    toObservable(this.event).pipe(
      map((event) => event?.Id),
      distinctUntilChanged(),
      switchMap((eventId) =>
        eventId ? this.reportsService.getEvaluationReports(eventId) : of([]),
      ),
      startWith([]),
    ),
  );
}
