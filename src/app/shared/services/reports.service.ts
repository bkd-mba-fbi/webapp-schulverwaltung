import { Injectable, Inject } from '@angular/core';
import { SETTINGS, Settings } from 'src/app/settings';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private baseUrl = `${this.settings.apiUrl}/Files/CrystalReports/Praesenzinformation`;

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private storageService: StorageService
  ) {}

  get personMasterDataReportUrl(): string {
    return `${this.baseUrl}/${this.settings.personMasterDataReportId}?token=${this.accessToken}`;
  }

  private get accessToken(): string {
    const token = this.storageService.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }
    return token;
  }
}
