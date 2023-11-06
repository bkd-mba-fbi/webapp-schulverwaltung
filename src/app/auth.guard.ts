import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./shared/services/auth.service";

export function authGuard(): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated) {
      return true;
    }

    // Redirect since not authenticated
    router.navigate(["/unauthenticated"]);
    return false;
  };
}
