import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpParams,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { HTTP_STATUS } from "src/app/shared/services/rest.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { nonEmptyString } from "src/app/shared/utils/filter";

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
  return httpParams.set("restConfig", JSON.stringify(config));
}

function extractConfig(params: HttpParams): {
  config: RestConfig;
  params: HttpParams;
} {
  return {
    config: JSON.parse(params.get("restConfig") || "{}"),
    params: params.delete("restConfig"),
  };
}

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
export function restErrorInterceptor(): HttpInterceptorFn {
  return (req, next) => {
    // TODO: there might be better ways of passing options to the
    // interceptor in the future, see:
    // https://github.com/angular/angular/issues/18155
    const { config, params } = extractConfig(req.params);
    return next(req.clone({ params })).pipe(
      catchError(getErrorHandler(config)),
    );
  };
}

function getErrorHandler(
  config: RestConfig,
): (
  error: unknown,
  caught: Observable<HttpEvent<unknown>>,
) => Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const toastService = inject(ToastService);
  const translate = inject(TranslateService);

  return (error: unknown): Observable<HttpEvent<unknown>> => {
    if (
      error instanceof HttpErrorResponse &&
      !config.disableErrorHandling &&
      (!config.disableErrorHandlingForStatus ||
        !config.disableErrorHandlingForStatus.includes(error.status))
    ) {
      switch (error.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          notifyError("noaccess");
          router.navigate(["/unauthenticated"]);
          return EMPTY;
        case HTTP_STATUS.FORBIDDEN:
          notifyError("noaccess");

          // Since access is forbidden to the requested resource,
          // redirect the user to the dashboard to avoid any
          // follow-up errors
          router.navigate(["/dashboard"]);

          return EMPTY;
        case HTTP_STATUS.NOT_FOUND:
          notifyError("notfound");
          return EMPTY;
        case HTTP_STATUS.UNKNOWN:
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
        case HTTP_STATUS.GATEWAY_TIMEOUT:
          notifyError("unavailable");
          return EMPTY;
        case HTTP_STATUS.CONFLICT: // Validation error
          notifyConflictError(error);
          return EMPTY;
        default:
          notifyError("server");
          return EMPTY;
      }
    }

    return throwError(() => error);
  };

  function notifyError(messageKey: string): void {
    toastService.error(
      translate.instant(`global.rest-errors.${messageKey}-message`),
      translate.instant(`global.rest-errors.${messageKey}-title`),
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
  function notifyConflictError(error: HttpErrorResponse): void {
    const defaultMessage = translate.instant(
      `global.rest-errors.conflict-message`,
    );
    const issues = parseConflictIssues(error);
    toastService.error(
      issues.length > 0 ? issues.join("\n") : defaultMessage,
      translate.instant(`global.rest-errors.conflict-title`),
    );
  }

  function parseConflictIssues(
    error: HttpErrorResponse,
  ): ReadonlyArray<string> {
    if (Array.isArray(error.error?.Issues)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return error.error.Issues.map((issue: any) => issue?.Message).filter(
        nonEmptyString,
      );
    }
    return [];
  }
}
