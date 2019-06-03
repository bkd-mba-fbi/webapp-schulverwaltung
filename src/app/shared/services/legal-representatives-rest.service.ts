import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import {
  LegalRepresentative,
  LegalRepresentativeProps
} from '../models/legal-representative.model';

@Injectable({
  providedIn: 'root'
})
export class LegalRepresentativesRestService extends RestService<
  LegalRepresentativeProps
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, LegalRepresentative, 'LegalRepresentatives');
  }
}
