import { Injectable, inject } from "@angular/core";
import { SETTINGS, Settings } from "src/app/settings";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class AvatarService {
  private settings = inject<Settings>(SETTINGS);
  private storageService = inject(StorageService);

  getAvatarUrl(studentId: number): string {
    const accessToken = this.storageService.getAccessToken() || "";
    return `${this.settings.apiUrl}/Files/personPictures/${studentId}?token=${accessToken}`;
  }

  getAvatarPlaceholderUrl(): string {
    return `${this.settings.scriptsAndAssetsPath}/assets/images/avatar-placeholder.png`;
  }
}
