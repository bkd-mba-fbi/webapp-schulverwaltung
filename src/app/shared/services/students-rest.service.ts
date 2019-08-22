import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SETTINGS, Settings } from '../../settings';
import { RestService } from './rest.service';
import { decodeArray } from '../utils/decode';
import { Student } from '../models/student.model';
import { LegalRepresentative } from '../models/legal-representative.model';
import { ApprenticeshipContract } from '../models/apprenticeship-contract.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsRestService extends RestService<typeof Student> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Student, 'Students');
  }

  getLegalRepresentatives(
    studentId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.http
      .get<any[]>(`${this.baseUrl}/${studentId}/LegalRepresentatives`, {
        params
      })
      .pipe(switchMap(decodeArray(LegalRepresentative)));
  }

  getCurrentApprenticeshipContracts(
    studentId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<ApprenticeshipContract>> {
    return this.http
      .get<any>(
        `${this.baseUrl}/${studentId}/ApprenticeshipContracts/Current`,
        {
          params
        }
      )
      .pipe(switchMap(decodeArray(ApprenticeshipContract)));
  }
}
