import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map, switchMap, throwError } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { RestErrorInterceptorOptions } from "../interceptors/rest-error.interceptor";

@Injectable({
  providedIn: "root",
})
export class AdditionalInformationsRestService {
  private http = inject(HttpClient);
  private settings = inject<Settings>(SETTINGS);

  uploadPhoto(studentId: number, file: File): Observable<void> {
    return this.preparePhotoUpload(studentId, file).pipe(
      switchMap((photoUploadPath) =>
        this.http.put(
          `${this.settings.apiUrl.replace("/restApi", "")}${photoUploadPath}`,
          file,
          {
            headers: { "Content-Type": file.type },
            context: new HttpContext().set(RestErrorInterceptorOptions, {
              disableErrorHandling: true,
            }),
          },
        ),
      ),
      map(() => undefined),
    );
  }

  private preparePhotoUpload(
    studentId: number,
    file: File,
  ): Observable<Option<string>> {
    const filename = file.name.replace(/\.jpe?g$/i, ".jpg");
    if (!filename.endsWith(".jpg")) {
      return throwError(
        () => new Error("Invalid file extension, must be a JPEG image"),
      );
    }

    const body = {
      AdditionalInformation: {
        ObjectId: studentId,
        ObjectTypeId: 3,
        Designation: "Photo",
      },
      FileStreamInfo: {
        // The filename must be ".jpg" (lowercase) or the backend won't process it (and there won't be any error)
        Filename: filename,
      },
    };
    return this.http
      .post(`${this.baseUrl}/files`, body, {
        observe: "response",
        context: new HttpContext().set(RestErrorInterceptorOptions, {
          disableErrorHandling: true,
        }),
      })
      .pipe(
        map((response) => {
          if (response.status !== 201) {
            throw new Error("Failed to get photo upload path");
          }
          const uploadPath = response.headers.get("Location");
          if (!uploadPath) {
            throw new Error("Invalid photo upload path");
          }
          return uploadPath;
        }),
      );
  }

  private get baseUrl(): string {
    return `${this.settings.apiUrl}/AdditionalInformations`;
  }
}
