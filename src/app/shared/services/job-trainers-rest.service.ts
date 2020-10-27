import { Inject, Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { JobTrainer } from '../models/job-trainer.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SETTINGS, Settings } from '../../settings';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { decode } from '../utils/decode';

@Injectable({
  providedIn: 'root',
})
export class JobTrainersRestService extends RestService<typeof JobTrainer> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, JobTrainer, 'JobTrainers');
  }

  getJobTrainer(
    jobTrainerId: number,
    params?: HttpParams | Dict<string>
  ): Observable<JobTrainer> {
    return this.http
      .get<unknown[]>(`${this.baseUrl}/${jobTrainerId}`, {
        params,
      })
      .pipe(switchMap(decode(JobTrainer)));
  }
}
