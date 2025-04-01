import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { distinctUntilChanged, map, of, startWith, switchMap } from "rxjs";
import { EvaluationEvent } from "src/app/events/services/evaluation-state.service";
import { BacklinkComponent } from "src/app/shared/components/backlink/backlink.component";
import { ReportsService } from "src/app/shared/services/reports.service";
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
  private route = inject(ActivatedRoute);

  event = input.required<EvaluationEvent>();

  reports = toSignal(
    toObservable(this.event).pipe(
      map((event) => event.id),
      distinctUntilChanged(),
      switchMap((eventId) =>
        eventId ? this.reportsService.getEvaluationReports(eventId) : of([]),
      ),
      startWith([]),
    ),
  );

  returnlink = this.route.snapshot.queryParamMap.get("returnlink") ?? "/events";
}
