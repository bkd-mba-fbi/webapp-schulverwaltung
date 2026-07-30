import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { RestErrorInterceptorOptions } from "../interceptors/rest-error.interceptor";
import { convertBlobToDataUri } from "../utils/blob";
import { catch404 } from "../utils/observable";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class AvatarService {
  private readonly settings = inject<Settings>(SETTINGS);
  private readonly storageService = inject(StorageService);
  private readonly http = inject(HttpClient);

  getAvatarUrl(studentId: number): string {
    const accessToken = this.storageService.getAccessToken() || "";
    return `${this.settings.apiUrl}/Files/personPictures/${studentId}?token=${accessToken}`;
  }

  getAvatarPlaceholderUrl(): string {
    return `${this.settings.scriptsAndAssetsPath}/assets/images/avatar-placeholder.png`;
  }

  loadAvatarDataUri(studentId: number): Observable<Option<string>> {
    const context = new HttpContext().set(RestErrorInterceptorOptions, {
      disableErrorHandlingForStatus: [404],
    });
    return this.http
      .get(this.getAvatarUrl(studentId), { context, responseType: "blob" })
      .pipe(switchMap(convertBlobToDataUri), catch404(null));
  }
}
