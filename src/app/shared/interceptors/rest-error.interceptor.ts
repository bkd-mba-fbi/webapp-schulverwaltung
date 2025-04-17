import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { HTTP_STATUS } from "src/app/shared/services/rest.service";
import { RestErrorNotificationService } from "../services/rest-error-notification.service";

interface Options {
  disableErrorHandling?: boolean;
  disableErrorHandlingForStatus?: ReadonlyArray<number>;
  disableErrorHandlingExceptForStatus?: ReadonlyArray<number>;
}

export const RestErrorInterceptorOptions = new HttpContextToken<Options>(
  () => ({
    disableErrorHandling: false,
    disableErrorHandlingForStatus: [],
    disableErrorHandlingExceptForStatus: [],
  }),
);

/**
 * Displays an error notification for all error status codes.
 *
 * It is possible to disable error handling for all status codes by setting the
 * option `skipErrorHandling` to `true`:
 *
 *   this.http.get('/', { context: new HttpContext().set(
 *     RestErrorInterceptorOptions, { disableErrorHandling: true }
 *     )
 *   }).pipe(catchError( handle request errors here... ))
 *
 * To disable error handling of only certain error codes, the option
 * `skipErrorHandlingForStatus` can be set to an array of status codes like
 * this:
 *
 *   this.http.get('/', { context: new HttpContext().set(
 *     RestErrorInterceptorOptions, { disableErrorHandlingForStatus: [403, 404]
 *     }
 *     )
 *   }).pipe(catchError( handle 403/404 here... ))
 *
 * To disable error handling of all error codes except certain ones, the option
 * `skipErrorHandlingExceptForStatus` can be set to an array of status codes
 * like this:
 *
 *   this.http.get('/', { context: new HttpContext().set(
 *     RestErrorInterceptorOptions, { disableErrorHandlingExceptForStatus: [401,
 *     403] }
 *     )
 *   }).pipe(catchError( handle 404 etc. here... ))
 */
export function restErrorInterceptor(): HttpInterceptorFn {
  return (req, next) => {
    const options = req.context.get(RestErrorInterceptorOptions);
    return next(req).pipe(catchError(getErrorHandler(options)));
  };
}

function getErrorHandler(
  config: Options,
): (
  error: unknown,
  caught: Observable<HttpEvent<unknown>>,
) => Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const restErrorService = inject(RestErrorNotificationService);

  return (error: unknown): Observable<HttpEvent<unknown>> => {
    if (
      error instanceof HttpErrorResponse &&
      !(
        config.disableErrorHandling ||
        disableForStatus(config, error.status) ||
        disableExceptForStatus(config, error.status)
      )
    ) {
      switch (error.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          restErrorService.notifyNoAccess();
          void router.navigate(["/unauthenticated"]);
          return EMPTY;
        case HTTP_STATUS.FORBIDDEN:
          restErrorService.notifyNoAccess();

          // Since access is forbidden to the requested resource,
          // redirect the user to the dashboard to avoid any
          // follow-up errors
          void router.navigate(["/dashboard"]);

          return EMPTY;
        default:
          // Default behavior for any other error status: display toast &
          // swallow error
          restErrorService.notifyHttpError(error);
          return EMPTY;
      }
    }

    return throwError(() => error);
  };

  function disableForStatus(config: Options, status: number): boolean {
    if (
      !config.disableErrorHandlingForStatus ||
      config.disableErrorHandlingForStatus.length === 0
    ) {
      return false;
    }

    return config.disableErrorHandlingForStatus.includes(status);
  }
  function disableExceptForStatus(config: Options, status: number): boolean {
    if (
      !config.disableErrorHandlingExceptForStatus ||
      config.disableErrorHandlingExceptForStatus.length === 0
    ) {
      return false;
    }

    return !config.disableErrorHandlingExceptForStatus.includes(status);
  }
}
