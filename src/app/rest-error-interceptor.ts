import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { HTTP_STATUS } from './shared/services/rest.service';
import { ToastService } from './shared/services/toast.service';
import { nonEmptyString } from './shared/utils/filter';

interface RestConfig {
  disableErrorHandling?: boolean;
  disableErrorHandlingForStatus?: ReadonlyArray<number>;
}

export function withConfig(
  config: RestConfig,
  params:
    | HttpParams
    | {
        [param: string]: string | string[];
      } = {},
): HttpParams {
  let httpParams: HttpParams;
  if (params instanceof HttpParams) {
    httpParams = params;
  } else {
    httpParams = new HttpParams({ fromObject: params });
  }
  return httpParams.set('restConfig', JSON.stringify(config));
}

function extractConfig(params: HttpParams): {
  config: RestConfig;
  params: HttpParams;
} {
  return {
    config: JSON.parse(params.get('restConfig') || '{}'),
    params: params.delete('restConfig'),
  };
}

@Injectable()
export class RestErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {}

  /**
   * Displays an error notification for all error status codes.
   *
   * It is possible to disable error handling for all status codes by
   * setting the config option `skipErrorHandling` to `true`:
   *
   *   const params = withConfig(
   *     { disableErrorHandling: true },
   *     { myParam: 'foobar' }
   *   );
   *   this.http.get('/', { params }).pipe(catchError( handle request errors here... ))
   *
   * To disable error handling of only certain error codes, the option
   * `skipErrorHandlingForStatus` can be set to an array of status
   * codes like this:
   *
   *   const params = withConfig(
   *     { disableErrorHandlingForStatus: [403, 404] },
   *     { myParam: 'foobar' }
   *   );
   *   this.http.get('/', { params }).pipe(catchError( handle 403/404 here... ))
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // TODO: there might be better ways of passing options to the
    // interceptor in the future, see:
    // https://github.com/angular/angular/issues/18155
    const { config, params } = extractConfig(req.params);
    return next
      .handle(req.clone({ params }))
      .pipe(catchError(this.getErrorHandler(config)));
  }

  private getErrorHandler(
    config: RestConfig,
  ): (
    error: unknown,
    caught: Observable<HttpEvent<unknown>>,
  ) => Observable<HttpEvent<unknown>> {
    return (error: unknown): Observable<HttpEvent<unknown>> => {
      if (
        error instanceof HttpErrorResponse &&
        !config.disableErrorHandling &&
        (!config.disableErrorHandlingForStatus ||
          !config.disableErrorHandlingForStatus.includes(error.status))
      ) {
        switch (error.status) {
          case HTTP_STATUS.UNAUTHORIZED:
            this.notifyError('noaccess');
            this.router.navigate(['/unauthenticated']);
            return EMPTY;
          case HTTP_STATUS.FORBIDDEN:
            this.notifyError('noaccess');
            return EMPTY;
          case HTTP_STATUS.NOT_FOUND:
            this.notifyError('notfound');
            return EMPTY;
          case HTTP_STATUS.UNKNOWN:
          case HTTP_STATUS.SERVICE_UNAVAILABLE:
          case HTTP_STATUS.GATEWAY_TIMEOUT:
            this.notifyError('unavailable');
            return EMPTY;
          case HTTP_STATUS.CONFLICT: // Validation error
            this.notifyConflictError(error);
            return EMPTY;
          default:
            this.notifyError('server');
            return EMPTY;
        }
      }

      return throwError(() => error);
    };
  }

  private notifyError(messageKey: string): void {
    this.toastService.error(
      this.translate.instant(`global.rest-errors.${messageKey}-message`),
      this.translate.instant(`global.rest-errors.${messageKey}-title`),
    );
  }

  /**
   * Displays an error notification containing the conflict response's
   * issues. The conflict response may have a body like this:
   *
   * {
   *   "HasErrors": true,
   *   "HasQuestions": false,
   *   "Issues": [
   *     {
   *       "ConflictDetail": null,
   *       "ConflictingKey": null,
   *       "ConflictingObject": null,
   *       "ConflictingObjectType": null,
   *       "Id": null,
   *       "Message": "Person ist bereits angemeldet: Die Anmeldung kann nicht erstellt werden.",
   *       "MessageId": null,
   *       "MessageType": "Error",
   *       "Property": null
   *     }
   *   ]
   * }
   */
  private notifyConflictError(error: HttpErrorResponse): void {
    const defaultMessage = this.translate.instant(
      `global.rest-errors.conflict-message`,
    );
    const issues = this.parseConflictIssues(error);
    this.toastService.error(
      issues.length > 0 ? issues.join('\n') : defaultMessage,
      this.translate.instant(`global.rest-errors.conflict-title`),
    );
  }

  private parseConflictIssues(error: HttpErrorResponse): ReadonlyArray<string> {
    if (Array.isArray(error.error?.Issues)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return error.error.Issues.map((issue: any) => issue?.Message).filter(
        nonEmptyString,
      );
    }
    return [];
  }
}
