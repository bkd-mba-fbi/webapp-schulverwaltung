import { InjectionToken } from '@angular/core';

export type StudentDossierBacklink = any[] | string;

/**
 * Provide the back link's URL for the student profile as follows (in
 * the module you are using the profile):
 *   { provide: STUDENT_DOSSIER_BACK_URL, useValue: '/example' }
 */
export const STUDENT_DOSSIER_BACKLINK = new InjectionToken<StudentDossierBacklink>(
  'Student Dossier backlink'
);
