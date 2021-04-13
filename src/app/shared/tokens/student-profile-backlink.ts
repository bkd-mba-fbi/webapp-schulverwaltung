import { InjectionToken } from '@angular/core';

export type StudentProfileBacklink = any[] | string;

/**
 * Provide the back link's URL for the student profile as follows (in
 * the module you are using the profile):
 *   { provide: STUDENT_PROFILE_BACK_URL, useValue: '/example' }
 */
export const STUDENT_PROFILE_BACKLINK = new InjectionToken<StudentProfileBacklink>(
  'Student Profile backlink'
);
