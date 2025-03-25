import { isDevMode } from "@angular/core";
import { CanActivateFn } from "@angular/router";

export function devModeGuard(): CanActivateFn {
  return () => {
    return isDevMode();
  };
}
