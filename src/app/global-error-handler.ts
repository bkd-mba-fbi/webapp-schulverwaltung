import { Injectable, ErrorHandler, NgZone } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "./shared/services/toast.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private ngZone: NgZone,
    private translate: TranslateService,
    private toastService: ToastService,
  ) {}

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
