import { InjectionToken } from '@angular/core';
import { Params } from '@angular/router';

export interface IConfirmAbsencesService {
  editBackLink?: any[];
  editBackLinkParams?: Params;
  updateAfterSave?: () => void;
}

/**
 * Provide the service with the necessary functions the edit
 * component uses:
 *   providers: [
 *     MyService,
 *     { provide: CONFIRM_ABSENCES_SERVICE, useExisting: 'MyService' },
 *   ]
 */
export const CONFIRM_ABSENCES_SERVICE = new InjectionToken<
  IConfirmAbsencesService
>('Confirm Absences Service');
