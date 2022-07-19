import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of, shareReplay, switchMap } from 'rxjs';
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

  getGradingScale(id: number | null): Observable<GradingScale | null> {
    if (id === null) return of(null);
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}`)
      .pipe(switchMap(decode(GradingScale)));
  }

  loadGradingScales(
    observable: Observable<(number | null)[]>
  ): Observable<ReadonlyArray<GradingScale | null>> {
    return observable.pipe(
      switchMap((ids) =>
        forkJoin(ids.map((id: number | null) => this.getGradingScale(id)))
      ),
      shareReplay(1)
    );
  }
}
