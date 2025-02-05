import { HttpErrorResponse } from "@angular/common/http";
import {
  ErrorHandler,
  Injectable,
  NgZone,
  Provider,
  inject,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "./toast.service";

export function provideGlobalErrorHandler(): Provider[] {
  return [{ provide: ErrorHandler, useClass: GlobalErrorHandler }];
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private ngZone = inject(NgZone);
  private translate = inject(TranslateService);
  private toastService = inject(ToastService);

  handleError(error: unknown): void {
    console.error(String(error));

    if (!(error instanceof HttpErrorResponse)) {
      this.notifyError();
    }
  }

  private notifyError(): void {
    this.ngZone.run(() => {
      this.toastService.error(
        this.translate.instant("global.app-errors.exception-message"),
        this.translate.instant("global.app-errors.exception-title"),
      );
    });
  }
}
