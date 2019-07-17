import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { Observable, empty, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { HTTP_STATUS } from './shared/services/rest.service';

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
      } = {}
): HttpParams {
  let httpParams: HttpParams;
  if (params instanceof HttpParams) {
    httpParams = params;
  } else {
    httpParams = new HttpParams({ fromObject: params });
  }
  return httpParams.set('restConfig', JSON.stringify(config));
}

function extractConfig(
  params: HttpParams
): { config: RestConfig; params: HttpParams } {
  return {
    config: JSON.parse(params.get('restConfig') || '{}'),
    params: params.delete('restConfig')
  };
}

@Injectable()
export class RestErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
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
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // TODO: there might be better ways of passing options to the
    // interceptor in the future, see:
    // https://github.com/angular/angular/issues/18155
    const { config, params } = extractConfig(req.params);
    return next
      .handle(req.clone({ params }))
      .pipe(catchError(this.getErrorHandler(config)));
  }

  private getErrorHandler(
    config: RestConfig
  ): (
    error: any,
    caught: Observable<HttpEvent<any>>
  ) => Observable<HttpEvent<any>> {
    // tslint:disable-next-line
    return (
      error: any,
      caught: Observable<HttpEvent<any>>
    ): Observable<HttpEvent<any>> => {
      if (
        error instanceof HttpErrorResponse &&
        !config.disableErrorHandling &&
        (!config.disableErrorHandlingForStatus ||
          !config.disableErrorHandlingForStatus.includes(error.status))
      ) {
        switch (error.status) {
          case HTTP_STATUS.UNAUTHORIZED:
          case HTTP_STATUS.FORBIDDEN:
            this.notifyError('noaccess');
            return empty();
          case HTTP_STATUS.NOT_FOUND:
            this.notifyError('notfound');
            return empty();
          case HTTP_STATUS.UNKNOWN:
          case HTTP_STATUS.SERVICE_UNAVAILABLE:
          case HTTP_STATUS.GATEWAY_TIMEOUT:
            this.notifyError('unavailable');
            return empty();
          case HTTP_STATUS.CONFLICT: // Validation error
            this.notifyError('conflict');
            return empty();
          default:
            this.notifyError('server');
            return empty();
        }
      }

      return throwError(error);
    };
  }

  private notifyError(messageKey: string): void {
    this.toastr.error(
      this.translate.instant(`global.errors.${messageKey}_message`),
      this.translate.instant(`global.errors.${messageKey}_title`)
    );
  }
}
