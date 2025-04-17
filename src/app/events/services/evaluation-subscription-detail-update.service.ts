import { HttpContext, HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnDestroy, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslateService } from "@ngx-translate/core";
import {
  Observable,
  Subject,
  concatMap,
  first,
  firstValueFrom,
  map,
  shareReplay,
  takeUntil,
} from "rxjs";
import { RestErrorInterceptorOptions } from "src/app/shared/interceptors/rest-error.interceptor";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { LoadingService } from "src/app/shared/services/loading-service";
import { RestErrorNotificationService } from "src/app/shared/services/rest-error-notification.service";
import { SubscriptionDetailsRestService } from "src/app/shared/services/subscription-details-rest.service";
import { ToastService } from "src/app/shared/services/toast.service";
import {
  EvaluationStateService,
  EvaluationSubscriptionDetail,
} from "./evaluation-state.service";

const EVALUTATION_UPDATE_CONTEXT = "events-evaluation-update";

type SubscriptionDetailChange = {
  detail: EvaluationSubscriptionDetail;
  value: SubscriptionDetail["Value"];
};

@Injectable()
export class EvaluationSubscriptionDetailUpdateService implements OnDestroy {
  private loadingService = inject(LoadingService);
  private subscriptionDetailsService = inject(SubscriptionDetailsRestService);
  private state = inject(EvaluationStateService);
  private restErrorService = inject(RestErrorNotificationService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  saving = toSignal(this.loadingService.loading(EVALUTATION_UPDATE_CONTEXT), {
    requireSync: true,
  });

  private subscriptionDetailQueue$ = new Subject<SubscriptionDetailChange>();
  private saveSubscriptionDetails$ = this.subscriptionDetailQueue$.pipe(
    // Save subscription details serially (one-by-one) to avoid race conditions
    concatMap(this.saveSubscriptionDetail.bind(this)),
    shareReplay(1),
  );
  private destroy$ = new Subject<void>();

  constructor() {
    this.saveSubscriptionDetails$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  async updateSubscriptionDetail(
    change: SubscriptionDetailChange,
  ): Promise<void> {
    if (change.detail.detail.Value === change.value) {
      // Value did not change, no need to update
      return;
    }

    try {
      const resultPromise = firstValueFrom(
        this.saveSubscriptionDetails$.pipe(
          first((result) => result.change === change),
        ),
      );
      this.subscriptionDetailQueue$.next(change);

      const result = await resultPromise;
      this.handleSubscriptionDetailSuccess(result.change);
    } catch (error) {
      this.handleSubscriptionDetailError(change, error);
    }
  }

  private handleSubscriptionDetailSuccess(
    change: SubscriptionDetailChange,
  ): void {
    // Apply the new value to the state
    this.state.updateSubscriptionDetail(change.detail.detail, change.value);
  }

  private handleSubscriptionDetailError(
    change: SubscriptionDetailChange,
    error: unknown,
  ): void {
    // Display error toast
    if (error instanceof HttpErrorResponse) {
      this.restErrorService.notifyHttpError(error);
    } else {
      this.toastService.error(
        this.translate.instant("global.app-errors.exception-message"),
        this.translate.instant("global.app-errors.exception-title"),
      );
    }

    // Reset back to old value, since it could not be saved
    change.detail.value?.set(change.detail.detail.Value);
  }

  private saveSubscriptionDetail(change: SubscriptionDetailChange): Observable<{
    change: SubscriptionDetailChange;
  }> {
    const context = new HttpContext().set(RestErrorInterceptorOptions, {
      disableErrorHandlingExceptForStatus: [401, 403],
    });
    return this.loadingService.load(
      this.subscriptionDetailsService
        .update(change.detail.detail, change.value, context)
        .pipe(
          map(() => ({
            change,
          })),
        ),
      EVALUTATION_UPDATE_CONTEXT,
    );
  }
}
