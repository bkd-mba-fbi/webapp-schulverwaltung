import { Injectable, inject } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly storage = inject(StorageService);

  get isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }

  get accessToken(): Option<string> {
    return this.storage.getAccessToken();
  }
}
