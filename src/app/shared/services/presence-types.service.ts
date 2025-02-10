import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
} from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { PresenceType } from "../models/presence-type.model";
import { sortPresenceTypes } from "../utils/presence-types";
import { PresenceTypesRestService } from "./presence-types-rest.service";

/**
 * This service provides the presence types and their variations. It
 * caches these entries to only load them once throughout the
 * application.
 */
@Injectable({
  providedIn: "root",
})
export class PresenceTypesService {
  private restService = inject(PresenceTypesRestService);
  private settings = inject<Settings>(SETTINGS);

  presenceTypes$ = this.loadPresenceTypes().pipe(shareReplay(1));

  /**
   * All currently active presence types
   */
  activePresenceTypes$ = this.presenceTypes$.pipe(
    map(this.filterActiveTypes.bind(this)),
    shareReplay(1),
  );

  /**
   * Currently active presence types that need confirmation
   */
  confirmationTypes$ = this.presenceTypes$.pipe(
    map(this.filterConfirmationTypes.bind(this)),
    shareReplay(1),
  );

  /**
   * Presence types that represent an incident
   */
  incidentTypes$ = this.presenceTypes$.pipe(
    map(this.filterIncidentTypes.bind(this)),
    shareReplay(1),
  );

  /**
   * Presence types that should be displayed in profile and in my
   * absences
   */
  displayedTypes$ = this.presenceTypes$.pipe(
    map(this.filterDisplayedTypes.bind(this)),
    shareReplay(1),
  );

  /**
   * Boolean whether half day type is active for current tenant
   */
  halfDayActive$ = this.presenceTypes$.pipe(
    map(this.isHalfDayActive.bind(this)),
    startWith(false),
    distinctUntilChanged(),
    shareReplay(1),
  );

  public getPresenceType(id: number): Observable<PresenceType> {
    return this.presenceTypes$.pipe(
      map((types) => {
        const type = types.find((t) => t.Id === id);
        if (!type) {
          throw new Error("presence type not found");
        }
        return type;
      }),
    );
  }

  private loadPresenceTypes(): Observable<ReadonlyArray<PresenceType>> {
    return this.restService.getList().pipe(map(sortPresenceTypes));
  }

  private filterActiveTypes(
    presenceTypes: ReadonlyArray<PresenceType>,
  ): ReadonlyArray<PresenceType> {
    return presenceTypes.filter((t) => t.Active);
  }

  private filterConfirmationTypes(
    presenceTypes: ReadonlyArray<PresenceType>,
  ): ReadonlyArray<PresenceType> {
    return presenceTypes.filter(
      (t) =>
        t.NeedsConfirmation &&
        t.Active &&
        t.Id !== this.settings.absencePresenceTypeId,
    );
  }

  private filterIncidentTypes(
    presenceTypes: ReadonlyArray<PresenceType>,
  ): ReadonlyArray<PresenceType> {
    return presenceTypes.filter((t) => t.IsIncident && t.Active);
  }

  private filterDisplayedTypes(
    presenceTypes: ReadonlyArray<PresenceType>,
  ): ReadonlyArray<PresenceType> {
    return presenceTypes.filter(
      (t) => t.Id !== this.settings.absencePresenceTypeId,
    );
  }

  private isHalfDayActive(presenceTypes: ReadonlyArray<PresenceType>): boolean {
    return Boolean(
      presenceTypes.find((t) => t.Id === this.settings.halfDayPresenceTypeId)
        ?.Active,
    );
  }
}
