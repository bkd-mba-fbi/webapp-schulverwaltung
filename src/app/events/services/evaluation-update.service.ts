import { Injectable, OnDestroy, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  Observable,
  Subject,
  concatMap,
  first,
  firstValueFrom,
  map,
  takeUntil,
} from "rxjs";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { LoadingService } from "src/app/shared/services/loading-service";
import { SubscriptionDetailsRestService } from "src/app/shared/services/subscription-details-rest.service";
import { EvaluationStateService } from "./evaluation-state.service";

const EVALUTATION_UPDATE_CONTEXT = "events-evaluation-update";

@Injectable()
export class EvaluationUpdateService implements OnDestroy {
  private loadingService = inject(LoadingService);
  private subscriptionDetailsService = inject(SubscriptionDetailsRestService);
  private state = inject(EvaluationStateService);

  private saving$ = this.loadingService.loading(EVALUTATION_UPDATE_CONTEXT);
  saving = toSignal(this.saving$, { requireSync: true });

  private subscriptionDetailQueue$ = new Subject<{
    detail: SubscriptionDetail;
    value: SubscriptionDetail["Value"];
  }>();
  private saveSubscriptionDetails$ = this.subscriptionDetailQueue$.pipe(
    // Save subscription details serially (one-by-one) to avoid race conditions
    concatMap(this.saveSubscriptionDetail.bind(this)),
  );
  private destroy$ = new Subject<void>();

  constructor() {
    this.saveSubscriptionDetails$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  async updateSubscriptionDetail(change: {
    detail: SubscriptionDetail;
    value: SubscriptionDetail["Value"];
  }): Promise<void> {
    this.subscriptionDetailQueue$.next(change);

    try {
      await firstValueFrom(
        this.saveSubscriptionDetails$.pipe(first((c) => c === change)),
      );

      // Apply saved value to detail if successfull
      change.detail.Value = change.value;
    } catch (error) {
      // The update was not successful, reload the client state so it doesn't
      // diverge from the server state.
      console.error("Error updating subscription detail:", error, change);
      this.state.reload();
    }
  }

  private saveSubscriptionDetail(change: {
    detail: SubscriptionDetail;
    value: SubscriptionDetail["Value"];
  }): Observable<{
    detail: SubscriptionDetail;
    value: SubscriptionDetail["Value"];
  }> {
    return this.loadingService.load(
      this.subscriptionDetailsService
        .update(change.detail, change.value)
        .pipe(map(() => change)),
      EVALUTATION_UPDATE_CONTEXT,
    );
  }
}
