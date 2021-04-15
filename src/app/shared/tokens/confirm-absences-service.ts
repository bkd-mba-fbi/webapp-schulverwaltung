import { InjectionToken } from '@angular/core';
import { Params } from '@angular/router';

export interface IConfirmAbsencesService {
  confirmBackLink?: any[];
  confirmBackLinkParams?: Params;
  updateAfterConfirm?: () => void;
}

/**
 * Provide the service with the necessary functions the confirm
 * component uses:
 *   providers: [
 *     MyService,
 *     { provide: CONFIRM_ABSENCES_SERVICE, useExisting: 'MyService' },
 *   ]
 */
export const CONFIRM_ABSENCES_SERVICE = new InjectionToken<IConfirmAbsencesService>(
  'Confirm Absences Service'
);
