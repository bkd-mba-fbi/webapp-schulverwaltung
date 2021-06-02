import {
  getNewConfirmationStateId,
  canChangePresenceType,
} from './presence-types';
import { buildLessonPresence, buildPresenceType } from 'src/spec-builders';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { settings } from 'src/spec-helpers';

describe('presence types', () => {
  let absenceType: PresenceType;
  let commentType: PresenceType;
  let incidentType: PresenceType;

  let lessonPresenceConfirmed: LessonPresence;
  let lessonPresenceUnapproved: LessonPresence;
  let lessonPresence: LessonPresence;

  beforeEach(() => {
    lessonPresenceConfirmed = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Zeichnen',
      'Vincent van Gogh',
      undefined,
      undefined,
      undefined,
      undefined,
      settings.unconfirmedAbsenceStateId
    );

    lessonPresenceUnapproved = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Zeichnen',
      'Vincent van Gogh',
      undefined,
      undefined,
      undefined,
      undefined,
      settings.checkableAbsenceStateId
    );

    lessonPresence = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Zeichnen',
      'Vincent van Gogh'
    );

    absenceType = buildPresenceType(
      settings.absencePresenceTypeId,
      true,
      false
    );
    commentType = buildPresenceType(6, false, false, true);
    incidentType = buildPresenceType(14, false, true, false);
  });

  describe('.getNewConfirmationStateId', () => {
    it('should return unconfirmedAbsenceStateId if given absence presence type matches absencePresenceTypeId', () => {
      expect(getNewConfirmationStateId(absenceType, settings)).toBe(
        settings.unconfirmedAbsenceStateId
      );
    });

    it('should return null if given absence presence type does not match absencePresenceTypeId', () => {
      expect(getNewConfirmationStateId(incidentType, settings)).toBe(null);
    });

    it('should return null if given absence presence type is null', () => {
      expect(getNewConfirmationStateId(null, settings)).toBe(null);
    });
  });

  describe('.canChangePresenceType', () => {
    it('should return true if is unapproved absence type', () => {
      expect(
        canChangePresenceType(lessonPresenceUnapproved, absenceType, settings)
      ).toBeTruthy();
    });

    it('should return true if is confirmed default absence type', () => {
      expect(
        canChangePresenceType(lessonPresenceConfirmed, absenceType, settings)
      ).toBeTruthy();
    });

    it('should return true if is comment absence type', () => {
      expect(
        canChangePresenceType(lessonPresence, commentType, settings)
      ).toBeTruthy();
    });

    it('should return true if absence type is null, e.g. present', () => {
      expect(
        canChangePresenceType(lessonPresence, null, settings)
      ).toBeTruthy();
    });

    it('should return true if is incident type', () => {
      expect(
        canChangePresenceType(lessonPresence, incidentType, settings)
      ).toBeTruthy();
    });
  });
});
