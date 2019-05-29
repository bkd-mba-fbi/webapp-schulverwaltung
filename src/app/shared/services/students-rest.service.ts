import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SETTINGS, Settings } from '../../settings';
import { RestService } from './rest.service';
import { decodeArray } from '../utils/decode';
import { Student, StudentProps } from '../models/student.model';
import { LegalRepresentative } from '../models/legal-representative.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsRestService extends RestService<StudentProps> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Student, 'Students');
  }

  getLegalRepresentatives(
    studentId: number,
    params?: Dict<string>
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.http
      .get<any[]>(`${this.baseUrl}/${studentId}/LegalRepresentatives`, {
        params
      })
      .pipe(switchMap(decodeArray(LegalRepresentative)));
  }
}
