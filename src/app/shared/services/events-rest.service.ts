import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Settings, SETTINGS } from '../../settings';
import { SubscriptionDetail } from '../models/subscription-detail.model';
import { decodeArray } from '../utils/decode';
import { RestService } from './rest.service';
import { Course } from 'src/app/shared/models/course.model';

@Injectable({
  providedIn: 'root',
})
export class EventsRestService extends RestService<typeof SubscriptionDetail> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, SubscriptionDetail, 'Events');
  }

  getSubscriptionDetailsDefinitions(
    eventId: number
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${eventId}/SubscriptionDetails`)
      .pipe(switchMap(decodeArray(this.codec)));
  }

  getDesignation(course: Course): string {
    const classes = course.Classes
      ? course.Classes.map((c) => c.Number).join(', ')
      : null;

    return classes ? course.Designation + ', ' + classes : course.Designation;
  }
}
