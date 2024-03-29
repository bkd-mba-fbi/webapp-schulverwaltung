import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SETTINGS, Settings } from "./settings";
import { AuthService } from "./shared/services/auth.service";

@Injectable()
export class RestAuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  /**
   * Adds the CLX-Authorization HTTP header to API requests.
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith(this.settings.apiUrl) && this.auth.accessToken) {
      const headers = req.headers.set(
        "CLX-Authorization",
        `token_type=urn:ietf:params:oauth:token-type:jwt-bearer, access_token=${this.auth.accessToken}`,
      );
      return next.handle(req.clone({ headers }));
    }
    return next.handle(req);
  }
}
