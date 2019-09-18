import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { PresenceType } from '../models/presence-type.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PresenceTypesRestService extends RestService<typeof PresenceType> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, PresenceType, 'PresenceTypes');
  }

  getConfirmationTypes(): Observable<ReadonlyArray<PresenceType>> {
    // Filtering with `?filter.NeedsConfirmation==true` seems not to
    // be working so filter the entries in the client. In addition to
    // that, exclude the default absence presence type and inactive
    // presence types.
    return this.getList().pipe(
      map(types =>
        types.filter(
          t =>
            t.NeedsConfirmation &&
            t.Active &&
            t.Id !== this.settings.absencePresenceTypeId
        )
      )
    );
  }
}
