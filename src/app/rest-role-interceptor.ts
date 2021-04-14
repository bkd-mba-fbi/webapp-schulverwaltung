import { Injectable, Inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SETTINGS, Settings } from './settings';

@Injectable()
export class RestRoleInterceptor implements HttpInterceptor {
  constructor(@Inject(SETTINGS) private settings: Settings) {}

  /**
   * Adds the X-Role-Restriction custom HTTP header for the given module to API requests.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !req.headers.has('X-Role-Restriction') &&
      this.settings.headerRoleRestriction
    ) {
      // TODO get header value for module
      const headers = req.headers.set('X-Role-Restriction', 'TODO');
      return next.handle(req.clone({ headers }));
    }

    return next.handle(req);
  }
}
