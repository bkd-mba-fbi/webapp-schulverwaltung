import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map, switchMap, throwError } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { RestErrorInterceptorOptions } from "../interceptors/rest-error.interceptor";
import { AdditionalInformation } from "../models/additional-informations.model";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class AdditionalInformationsRestService extends RestService<
  typeof AdditionalInformation
> {
  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, AdditionalInformation, "AdditionalInformations");
  }

  /**
   * Creates an AdditionalInformation entry.
   */
  create(
    entry: Partial<AdditionalInformation>,
    options: { context?: HttpContext } = {},
  ): Observable<void> {
    return this.http
      .post(`${this.baseUrl}/`, entry, options)
      .pipe(map(() => undefined));
  }

  /**
   * Creates an AdditionalInformation entry with an associated file (two
   * requests). Error responses are not handled by the interceptor and must be
   * handled by the consumer.
   */
  createWithFile(
    entry: Partial<AdditionalInformation>,
    file: File,
    filename: string,
  ): Observable<void> {
    return this.createFileEntry(entry, filename).pipe(
      switchMap(({ fileUploadPath }) => this.uploadFile(file, fileUploadPath)),
    );
  }

  /**
   * Uploads the avatar image (two requests). Error responses are not handled by
   * the interceptor and must be handled by the consumer.
   */
  createAvatar(studentId: number, file: File): Observable<void> {
    // The filename must be ".jpg" (lowercase) or the backend won't process it
    // (and there won't be any error)
    const filename = file.name.replace(/\.jpe?g$/i, ".jpg");
    if (!filename.endsWith(".jpg")) {
      return throwError(
        () => new Error("Invalid file extension, must be a JPEG image"),
      );
    }

    return this.createWithFile(
      {
        ObjectId: studentId,
        ObjectTypeId: 3,
        Designation: "Photo",
      },
      file,
      filename,
    );
  }

  /**
   * Create an AdditionalInformations entry with an associated file. The file
   * itself must then be uploaded in a second request using {@link uploadFile}
   * and the returned `fileUploadPath`.
   */
  private createFileEntry(
    entry: Partial<AdditionalInformation>,
    filename: string,
  ): Observable<{ fileUploadPath: string }> {
    const body = {
      AdditionalInformation: entry,
      FileStreamInfo: {
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
            throw new Error("Failed to get file upload path");
          }
          const fileUploadPath = response.headers.get("Location");
          if (!fileUploadPath) {
            throw new Error("Invalid file upload path");
          }
          return { fileUploadPath };
        }),
      );
  }

  /**
   * Upload the actual file using the `fileUploadPath` as returned by
   * {@link createFileEntry}.
   */
  private uploadFile(file: File, fileUploadPath: string): Observable<void> {
    return this.http
      .put(
        `${this.settings.apiUrl.replace("/restApi", "")}${fileUploadPath}`,
        file,
        {
          headers: { "Content-Type": file.type },
          context: new HttpContext().set(RestErrorInterceptorOptions, {
            disableErrorHandling: true,
          }),
        },
      )
      .pipe(map(() => undefined));
  }
}
