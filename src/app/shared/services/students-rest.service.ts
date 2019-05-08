import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SettingsService } from './settings.service';
import { RestService } from './rest.service';
import { Student } from '../models/student.model';
import { LegalRepresentative } from '../models/legal-representative.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsRestService extends RestService<Student> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, 'Students');
  }

  protected buildEntry(json: any): Student {
    return Student.from(json);
  }

  getLegalRepresentatives(
    studentId: number,
    params?: any
  ): Observable<ReadonlyArray<LegalRepresentative>> {
    return this.withBaseUrl(url =>
      this.http
        .get<any[]>(
          `${url}/${studentId}/LegalRepresentatives`,
          this.buildRequestOptions(params)
        )
        .pipe(
          map((json: any[]) =>
            this.buildList(json, data => LegalRepresentative.from(data))
          )
        )
    );
  }
}
