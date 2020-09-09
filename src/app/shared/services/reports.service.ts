import { Injectable, Inject } from '@angular/core';

import { SETTINGS, Settings } from 'src/app/settings';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private baseUrl = `${this.settings.apiUrl}/Files/CrystalReports`;

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private storageService: StorageService
  ) {}

  getPersonMasterDataReportUrl(personId: number): string {
    return this.getReportUrl('Person', this.settings.personMasterDataReportId, [
      personId,
    ]);
  }

  private getReportUrl(
    context: string,
    reportId: number,
    recordIds: ReadonlyArray<number>
  ): string {
    return `${this.baseUrl}/${context}/${reportId}?ids=${recordIds.join(
      ','
    )}&token=${this.accessToken}`;
  }

  // private isReportAvailable(
  //   context: string,
  //   reportId: number
  // ): Observable<boolean> {
  //   return this.http
  //     .get<boolean>(
  //       `${this.baseUrl}/AvailableReports/${context}?ids=${reportId}&keys=0`
  //     )
  //     .pipe(log('availableReports'));
  // }

  private get accessToken(): string {
    const token = this.storageService.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }
    return token;
  }
}
