import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, firstValueFrom, map } from "rxjs";
import { SETTINGS, Settings } from "../../settings";
import { LoadingService } from "./loading-service";
import { PAGE_LOADING_CONTEXT } from "./paginated-entries.service";

@Injectable({
  providedIn: "root",
})
export class StatusProcessesRestService {
  private http = inject(HttpClient);
  private settings = inject<Settings>(SETTINGS);
  private loadingService = inject(LoadingService);
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${this.settings.apiUrl}/StatusProcesses/`;
  }

  async forwardStatus(statusId: number, eventId: number): Promise<boolean> {
    try {
      const nextStatus = await firstValueFrom(
        this.loadingService.load(
          this.getStatus(statusId),
          PAGE_LOADING_CONTEXT,
        ),
      );

      if (nextStatus) {
        await firstValueFrom(
          this.loadingService.load(
            this.updateStatus(nextStatus, eventId),
            PAGE_LOADING_CONTEXT,
          ),
        );
        return true;
      } else {
        console.error("No next status found");
        return false;
      }
    } catch (error) {
      console.error("Error updating status", error);
      return false;
    }
  }

  private getStatus(statusId: number): Observable<unknown> {
    return this.http
      .get<unknown[]>(`${this.baseUrl}forward/`, {
        params: new HttpParams().set("idStatus", statusId.toString()),
      })
      .pipe(
        map((response) =>
          Array.isArray(response) && response.length > 0 ? response[0] : null,
        ),
      );
  }

  private updateStatus(
    statusProcess: unknown,
    eventId?: number,
  ): Observable<unknown> {
    return this.http.post<unknown>(this.baseUrl, {
      ...(statusProcess as object),
      DataClassId: "Anlass",
      Id1: eventId,
    });
  }
}
