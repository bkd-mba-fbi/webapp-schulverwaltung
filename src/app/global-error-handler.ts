import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private ngZone: NgZone,
    private injector: Injector,
    private translate: TranslateService
  ) {}

  handleError(error: any): void {
    console.error(String(error));

    if (!(error instanceof HttpErrorResponse)) {
      this.notifyError();
    }
  }

  private notifyError(): void {
    // Inject and use ToastrService within ngZone, see:
    // https://github.com/scttcper/ngx-toastr/issues/179
    this.ngZone.run(() => {
      this.toastr.error(
        this.translate.instant('global.app-errors.exception-message'),
        this.translate.instant('global.app-errors.exception-title')
      );
    });
  }

  private get toastr(): ToastrService {
    return this.injector.get(ToastrService);
  }
}
