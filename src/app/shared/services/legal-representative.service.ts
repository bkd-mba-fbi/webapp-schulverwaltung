import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SettingsService } from './settings.service';
import { LegalRepresentative } from '../models/legal-representative.model';

@Injectable({
  providedIn: 'root'
})
export class LegalRepresentativeService extends RestService<
  LegalRepresentative
> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, 'LegalRepresentatives');
  }

  protected buildEntry(json: any): LegalRepresentative {
    return LegalRepresentative.from(json);
  }
}
