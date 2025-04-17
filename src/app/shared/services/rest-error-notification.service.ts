import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { nonEmptyString } from "../utils/filter";
import { HTTP_STATUS } from "./rest.service";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: "root",
})
export class RestErrorNotificationService {
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  /**
   * Displays a toast for the given HTTP error response, excluding for 401
   * Unauthorized and 403 Forbidden, which are handled by the error interceptor.
   */
  notifyHttpError(error: HttpErrorResponse): void {
    switch (error.status) {
      case HTTP_STATUS.UNAUTHORIZED:
      case HTTP_STATUS.FORBIDDEN:
        // Are handled by the error interceptor, followed by a redirect
        return;
      case HTTP_STATUS.NOT_FOUND:
        return this.notifyNotFound();
      case HTTP_STATUS.UNKNOWN:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
      case HTTP_STATUS.GATEWAY_TIMEOUT:
        return this.notifyUnavailable();
      case HTTP_STATUS.CONFLICT: // Validation error
        return this.notifyConflict(error);
      default:
        return this.notifyServerError();
    }
  }

  notifyNoAccess(): void {
    this.notifyMessage("noaccess");
  }

  notifyNotFound(): void {
    this.notifyMessage("notfound");
  }

  notifyUnavailable(): void {
    this.notifyMessage("unavailable");
  }

  notifyServerError(): void {
    this.notifyMessage("server");
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
  notifyConflict(error: HttpErrorResponse): void {
    const defaultMessage = this.translate.instant(
      `global.rest-errors.conflict-message`,
    );
    const issues = this.parseConflictIssues(error);
    this.toastService.error(
      issues.length > 0 ? issues.join("\n") : defaultMessage,
      this.translate.instant(`global.rest-errors.conflict-title`),
    );
  }

  private notifyMessage(messageKey: string): void {
    this.toastService.error(
      this.translate.instant(`global.rest-errors.${messageKey}-message`),
      this.translate.instant(`global.rest-errors.${messageKey}-title`),
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
