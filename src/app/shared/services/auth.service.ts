import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private storage: StorageService) {}

  get isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }

  get accessToken(): Option<string> {
    return this.storage.getAccessToken();
  }
}
