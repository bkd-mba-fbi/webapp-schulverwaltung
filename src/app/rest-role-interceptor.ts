import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SETTINGS, Settings } from './settings';
import { Router } from '@angular/router';
import camelCase from 'lodash-es/camelCase';
import { getFirstSegment } from './shared/utils/url';

@Injectable()
export class RestRoleInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  /**
   * Adds the X-Role-Restriction custom HTTP header for the given module to API requests.
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (
      !req.headers.has('X-Role-Restriction') &&
      this.settings.headerRoleRestriction
    ) {
      const module = this.getCurrentModuleName();
      if (module && this.settings.headerRoleRestriction[module]) {
        const headers = req.headers.set(
          'X-Role-Restriction',
          this.settings.headerRoleRestriction[module],
        );
        return next.handle(req.clone({ headers }));
      }
    }

    return next.handle(req);
  }

  private getCurrentModuleName(): string | null {
    const urlSegment = this.router.url
      ? getFirstSegment(this.router.url)
      : null;
    return urlSegment ? camelCase(urlSegment) : null;
  }
}
