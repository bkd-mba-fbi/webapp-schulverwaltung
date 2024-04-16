import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { camelCase } from "lodash-es";
import { SETTINGS, Settings } from "src/app/settings";
import { getFirstSegment } from "src/app/shared/utils/url";

/**
 * Adds the X-Role-Restriction custom HTTP header for the given module to API requests.
 */
export function restRoleInterceptor(): HttpInterceptorFn {
  return (req, next) => {
    const settings: Settings = inject(SETTINGS);

    if (
      !req.headers.has("X-Role-Restriction") &&
      settings.headerRoleRestriction
    ) {
      const module = getCurrentModuleName();
      if (module && settings.headerRoleRestriction[module]) {
        const headers = req.headers.set(
          "X-Role-Restriction",
          settings.headerRoleRestriction[module],
        );
        return next(req.clone({ headers }));
      }
    }

    return next(req);
  };
}

function getCurrentModuleName(): string | null {
  const router = inject(Router);
  const urlSegment = router.url ? getFirstSegment(router.url) : null;
  return urlSegment ? camelCase(urlSegment) : null;
}
