import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DossierGradesService {
  private studentId$ = new ReplaySubject<number>(1);

  constructor() {}

  setStudentId(id: number) {
    this.studentId$.next(id);
  }
}
