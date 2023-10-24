import { InjectionToken } from '@angular/core';
import { Params, Router } from '@angular/router';

export interface IConfirmAbsencesService {
  confirmBackLink?: Parameters<Router['navigate']>[0];
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
export const CONFIRM_ABSENCES_SERVICE =
  new InjectionToken<IConfirmAbsencesService>('Confirm Absences Service');
