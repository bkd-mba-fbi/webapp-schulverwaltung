import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Settings, SETTINGS } from '../../settings';
import { SubscriptionDetail } from '../models/subscription-detail.model';
import { decodeArray } from '../utils/decode';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsRestService extends RestService<
  typeof SubscriptionDetail
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, SubscriptionDetail, 'Subscriptions');
  }

  getListByRegistrationId(
    registrationId: number
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${registrationId}/SubscriptionDetails`)
      .pipe(switchMap(decodeArray(this.codec)));
  }
}