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
import { kebabToCamelCase } from 'codelyzer/util/utils';
import { getFirstSegment } from './shared/utils/url';

@Injectable()
export class RestRoleInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(SETTINGS) private settings: Settings
  ) {}

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
      const module = this.getCurrentModuleName();
      if (module && this.settings.headerRoleRestriction[module]) {
        const headers = req.headers.set(
          'X-Role-Restriction',
          this.settings.headerRoleRestriction[module]
        );
        return next.handle(req.clone({ headers }));
      }
    }

    return next.handle(req);
  }

  private getCurrentModuleName(): string | null {
    const urlSegment = getFirstSegment(this.router.url);
    return urlSegment ? kebabToCamelCase(urlSegment) : null;
  }
}
