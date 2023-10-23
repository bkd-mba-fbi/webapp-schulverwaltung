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
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';

describe('OpenAbsencesService', () => {
  let service: OpenAbsencesService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          OpenAbsencesService,
          ConfirmAbsencesSelectionService,
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
            bodyToLargeForEmailTo: 'Text zu lang für übergabe an Mailprogramm.',
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
      const absence2 = buildLessonPresence(
        1,
        new Date(2021, 3, 29, 9, 0),
        new Date(2021, 3, 29, 9, 45),
        'Deutsch-S1'
      );
      const absence3 = buildLessonPresence(
        1,
        new Date(2021, 4, 3, 10, 5),
        new Date(2021, 4, 3, 10, 50),
        'Englisch-S3'
      );

      const absences: LessonPresence[] = [absence1, absence2, absence3];

      expect(service.buildMailToString(person, absences)).toEqual(
        `foo@bar.ch?subject=open-absences.detail.mail.subject&body=open-absences.detail.mail.body%0D%0ADeutsch-S1, 22.04.2021, 09:00-09:45%0D%0ADeutsch-S1, 29.04.2021, 09:00-09:45%0D%0AEnglisch-S3, 03.05.2021, 10:05-10:50`
      );

      const absence4 = buildLessonPresence(
        1,
        new Date(2021, 4, 3, 10, 5),
        new Date(2021, 4, 3, 10, 50),
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'
      );

      const absencesToMuchChar: LessonPresence[] = [absence4];
      expect(
        service.buildMailToString(person, absencesToMuchChar).length
      ).toBeLessThanOrEqual(1650);
    });
  });
});
