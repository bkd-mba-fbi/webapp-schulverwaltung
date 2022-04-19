import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
import { GradingScale } from '../models/grading-scale.model';
import { decode } from '../utils/decode';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class GradingScalesRestService extends RestService<typeof GradingScale> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, GradingScale, 'GradingScales');
  }

  getGradingScale(id: number): Observable<GradingScale> {
    const scale = {} as GradingScale;
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}`)
      .pipe(switchMap(decode(GradingScale)));
  }
}
