import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  handleError(error: any): void {
    console.error(error);
    console.error(String(error));

    if (!(error instanceof HttpErrorResponse)) {
      this.notifyError();
    }
  }

  private notifyError(): void {
    this.toastr.error(
      this.translate.instant('global.errors.exception_message'),
      this.translate.instant('global.errors.exception_title')
    );
  }
}
