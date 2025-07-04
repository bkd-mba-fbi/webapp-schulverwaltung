import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { distinctUntilChanged, map, of, startWith, switchMap } from "rxjs";
import {
  EvaluationEvent,
  EvaluationStateService,
} from "src/app/events/services/evaluation-state.service";
import { BacklinkComponent } from "src/app/shared/components/backlink/backlink.component";
import { ReportsService } from "src/app/shared/services/reports.service";
import { ReportsLinkComponent } from "../../../../shared/components/reports-link/reports-link.component";

@Component({
  selector: "bkd-evaluation-header",
  imports: [BacklinkComponent, TranslatePipe, ReportsLinkComponent, RouterLink],
  templateUrl: "./evaluation-header.component.html",
  styleUrl: "./evaluation-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationHeaderComponent {
  private reportsService = inject(ReportsService);
  private route = inject(ActivatedRoute);
  private state = inject(EvaluationStateService);

  hasGradeEntries = computed(() =>
    this.state.entries().some((entry) => (entry.grade?.Value ?? 0) > 0),
  );

  event = input.required<EvaluationEvent>();
  showActions = input<boolean>(true);
  queryParam = signal<string | null>(
    this.route.snapshot.queryParamMap.get("returnlink"),
  );

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

  returnlink = computed(() => {
    if (!this.showActions()) {
      return `/events/${this.event().id}/evaluation`;
    }

    if (this.queryParam()) {
      return this.queryParam();
    }

    return "/events";
  });
}
