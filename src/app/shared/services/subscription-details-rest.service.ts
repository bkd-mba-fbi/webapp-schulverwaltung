import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Settings, SETTINGS } from '../../settings';
import { SubscriptionDetail } from '../models/subscription-detail.model';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionDetailsRestService extends RestService<
  typeof SubscriptionDetail
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, SubscriptionDetail, 'SubscriptionDetails');
  }

  update(group: Option<string>, detail: SubscriptionDetail): Observable<void> {
    const body = {
      IdPerson: detail.IdPerson,
      EventId: detail.EventId,
      Value: group,
    };
    return this.http
      .put<void>(`${this.baseUrl}/${detail.Id}`, body)
      .pipe(mapTo(undefined));
  }
}