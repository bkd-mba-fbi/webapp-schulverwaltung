import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SETTINGS, Settings } from '../../settings';
import { RestService } from './rest.service';
import { ApprenticeshipContract } from '../models/apprenticeship-contract.model';

@Injectable({
  providedIn: 'root',
})
export class ApprenticeshipContractsRestService extends RestService<
  typeof ApprenticeshipContract
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, ApprenticeshipContract, 'ApprenticeshipContracts');
  }
}
