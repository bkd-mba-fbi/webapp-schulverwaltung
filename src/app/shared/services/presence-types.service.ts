import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  shareReplay,
  map,
  startWith,
  distinctUntilChanged,
} from 'rxjs/operators';

import { PresenceTypesRestService } from './presence-types-rest.service';
import { PresenceType } from '../models/presence-type.model';
import { SETTINGS, Settings } from 'src/app/settings';
import { sortPresenceTypes } from '../utils/presence-types';

/**
 * This service provides the presence types and their variations. It
 * caches these entries to only load them once throughout the
 * application.
 */
@Injectable({
  providedIn: 'root',
})
export class PresenceTypesService {
  presenceTypes$ = this.loadPresenceTypes().pipe(shareReplay(1));

  activePresenceTypes$ = this.presenceTypes$.pipe(
    map(this.filterActiveTypes.bind(this)),
    shareReplay(1)
  );

  confirmationTypes$ = this.presenceTypes$.pipe(
    map(this.filterConfirmationTypes.bind(this)),
    shareReplay(1)
  );

  incidentTypes$ = this.presenceTypes$.pipe(
    map(this.filterIncidentTypes.bind(this)),
    shareReplay(1)
  );

  halfDayActive$ = this.presenceTypes$.pipe(
    map(this.isHalfDayActive.bind(this)),
    startWith(false),
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(
    private restService: PresenceTypesRestService,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  private loadPresenceTypes(): Observable<ReadonlyArray<PresenceType>> {
    return this.restService.getList().pipe(map(sortPresenceTypes));
  }

  private filterActiveTypes(
    presenceTypes: ReadonlyArray<PresenceType>
  ): ReadonlyArray<PresenceType> {
    return presenceTypes.filter((t) => t.Active);
  }

  private filterConfirmationTypes(
    presenceTypes: ReadonlyArray<PresenceType>
  ): ReadonlyArray<PresenceType> {
    return presenceTypes.filter(
      (t) =>
        t.NeedsConfirmation &&
        t.Active &&
        t.Id !== this.settings.absencePresenceTypeId
    );
  }

  private filterIncidentTypes(
    presenceTypes: ReadonlyArray<PresenceType>
  ): ReadonlyArray<PresenceType> {
    return presenceTypes.filter((t) => t.IsIncident);
  }

  private isHalfDayActive(presenceTypes: ReadonlyArray<PresenceType>): boolean {
    return Boolean(
      presenceTypes.find((t) => t.Id === this.settings.halfDayPresenceTypeId)
        ?.Active
    );
  }
}
