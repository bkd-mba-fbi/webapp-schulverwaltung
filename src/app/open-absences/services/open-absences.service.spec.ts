import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { OpenAbsencesService } from './open-absences.service';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import {
  buildLessonPresence,
  buildPersonWithEmails,
} from '../../../spec-builders';
import { LessonPresence } from '../../shared/models/lesson-presence.model';

describe('OpenAbsencesService', () => {
  let service: OpenAbsencesService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          OpenAbsencesService,
          {
            provide: LessonPresencesRestService,
            useValue: {
              getListOfUnconfirmed(): any {
                return of([]);
              },
            },
          },
        ],
      })
    );
    service = TestBed.inject(OpenAbsencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildMailToString', () => {
    const translation = {
      'open-absences': {
        detail: {
          mail: {
            subject: 'Erinnerung offene Absenzen',
            body: 'Bitte entschuldigen Sie folgende offenen Absenzen:',
          },
        },
      },
    };

    it('returns an mailto string observable for the given person and absences', () => {
      const person = buildPersonWithEmails(3, '', 'foo@bar.ch');

      const absence1 = buildLessonPresence(
        1,
        new Date(2021, 3, 22, 9, 0),
        new Date(2021, 3, 22, 9, 45),
        'Deutsch-S1'
      );
      absence1.Type = 'Andere Gründe';
      const absence2 = buildLessonPresence(
        1,
        new Date(2021, 3, 29, 9, 0),
        new Date(2021, 3, 29, 9, 45),
        'Deutsch-S1'
      );
      absence2.Type = 'Teilnahme an externen Kursen';
      const absence3 = buildLessonPresence(
        1,
        new Date(2021, 4, 3, 10, 5),
        new Date(2021, 4, 3, 10, 50),
        'Englisch-S3'
      );

      const absences: LessonPresence[] = [absence1, absence2, absence3];

      expect(service.buildMailToString(person, absences, translation)).toEqual(
        `foo@bar.ch?subject=Erinnerung offene Absenzen&body=Bitte entschuldigen Sie folgende offenen Absenzen:%0D%0ADeutsch-S1, 22.04.2021, 09:00-09:45: Andere Gründe%0D%0ADeutsch-S1, 29.04.2021, 09:00-09:45: Teilnahme an externen Kursen%0D%0AEnglisch-S3, 03.05.2021, 10:05-10:50: `
      );
    });
  });
});
