import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { SETTINGS, Settings } from "src/app/settings";
import { AuthService } from "src/app/shared/services/auth.service";

/**
 * Adds the Authorization HTTP header to API requests.
 */
export function restAuthInterceptor(): HttpInterceptorFn {
  return (req, next) => {
    const auth = inject(AuthService);
    const settings: Settings = inject(SETTINGS);

    if (req.url.startsWith(settings.apiUrl) && auth.accessToken) {
      const headers = req.headers.set(
        "Authorization",
        `Bearer ${auth.accessToken}`,
      );
      return next(req.clone({ headers }));
    }
    return next(req);
  };
}
