import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SETTINGS, Settings } from '../../settings';
import { RestService } from './rest.service';
import {
  ApprenticeshipContractProps,
  ApprenticeshipContract
} from '../models/apprenticeship-contract.model';

@Injectable({
  providedIn: 'root'
})
export class ApprenticeshipContractsService extends RestService<
  ApprenticeshipContractProps
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, ApprenticeshipContract, 'ApprenticeshipContracts');
  }
}
