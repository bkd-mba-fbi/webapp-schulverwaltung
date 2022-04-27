import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { mapTo, Observable } from 'rxjs';
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

  updateGrade(
    finaleGradeId: number,
    selectedGradeId: number
  ): Observable<number> {
    return this.http
      .put(`${this.baseUrl}/${finaleGradeId}`, this.createBody(selectedGradeId))
      .pipe(mapTo(finaleGradeId));
  }

  private createBody(id: number) {
    return { IdGrade: id, GradeValue: null };
  }
}
