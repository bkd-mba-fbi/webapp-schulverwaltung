import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { number } from 'fp-ts';
import { mapTo, Observable, of } from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
import { Grading } from '../models/course.model';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class GradingsRestService extends RestService<typeof Grading> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Grading, 'Gradings');
  }

  updateGrade(id: number, value: number): Observable<number> {
    return this.http
      .put(`${this.baseUrl}/${id}`, this.createBody(id, value))
      .pipe(mapTo(id));
  }

  private createBody(id: number, value: number) {
    return { IdGrade: id, GradeValue: value };
  }
}
