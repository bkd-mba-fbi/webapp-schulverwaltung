import { HttpContext, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslateService } from "@ngx-translate/core";
import { Observable, catchError, firstValueFrom, map, of } from "rxjs";
import { RestErrorInterceptorOptions } from "src/app/shared/interceptors/rest-error.interceptor";
import { LoadingService } from "src/app/shared/services/loading-service";
import { RestErrorNotificationService } from "src/app/shared/services/rest-error-notification.service";
import { SubscriptionDetailsRestService } from "src/app/shared/services/subscription-details-rest.service";
import { ToastService } from "src/app/shared/services/toast.service";
import {
  EvaluationStateService,
  EvaluationSubscriptionDetail,
} from "./evaluation-state.service";

const EVALUTATION_UPDATE_CONTEXT = "events-evaluation-update";

@Injectable()
export class EvaluationSubscriptionDetailUpdateService {
  private loadingService = inject(LoadingService);
  private subscriptionDetailsService = inject(SubscriptionDetailsRestService);
  private state = inject(EvaluationStateService);
  private restErrorService = inject(RestErrorNotificationService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  saving = toSignal(this.loadingService.loading(EVALUTATION_UPDATE_CONTEXT), {
    requireSync: true,
  });

  async updateSubscriptionDetail(
    evaluationDetail: EvaluationSubscriptionDetail,
  ): Promise<void> {
    const { detail, value } = evaluationDetail;
    if (!value) return;

    if (detail.Value === value()) {
      // Value did not change, no need to update
      return;
    }

    const { error } = await firstValueFrom(
      this.saveSubscriptionDetail({ detail, value }),
    );
    if (error) {
      this.handleSubscriptionDetailError(evaluationDetail, error);
    } else {
      this.handleSubscriptionDetailSuccess(evaluationDetail);
    }
  }

  private handleSubscriptionDetailSuccess(
    evaluationDetail: EvaluationSubscriptionDetail,
  ): void {
    const { detail, value } = evaluationDetail;
    if (!value) return;

    // Apply the new value to the state
    this.state.updateSubscriptionDetail(detail, value());
  }

  private handleSubscriptionDetailError(
    evaluationDetail: EvaluationSubscriptionDetail,
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
    const { detail, value } = evaluationDetail;
    value?.set(detail.Value);
  }

  private saveSubscriptionDetail(
    evaluationDetail: EvaluationSubscriptionDetail,
  ): Observable<{
    error?: unknown;
  }> {
    const { detail, value } = evaluationDetail;
    if (!value) return of({});

    const context = new HttpContext().set(RestErrorInterceptorOptions, {
      disableErrorHandlingExceptForStatus: [401, 403],
    });
    return this.loadingService.load(
      this.subscriptionDetailsService.update(detail, value(), context).pipe(
        map(() => ({})),
        catchError((error) => of({ error })),
      ),
      EVALUTATION_UPDATE_CONTEXT,
    );
  }
}
