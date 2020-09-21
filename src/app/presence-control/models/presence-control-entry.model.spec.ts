import {
  PresenceControlEntry,
  PresenceCategory,
} from './presence-control-entry.model';
import { buildLessonPresence, buildPresenceType } from 'src/spec-builders';
import { PresenceType } from 'src/app/shared/models/presence-type.model';

describe('PresenceControlEntry', () => {
  let absenceType: PresenceType;
  let dispensationType: PresenceType;
  let halfDayType: PresenceType;
  let incidentType: PresenceType;
  let commentType: PresenceType;
  let presenceTypes: ReadonlyArray<PresenceType>;
  let entry: PresenceControlEntry;

  beforeEach(() => {
    absenceType = buildPresenceType(1, true, false);
    dispensationType = buildPresenceType(2, false, false);
    dispensationType.IsDispensation = true;
    halfDayType = buildPresenceType(3, false, false);
    halfDayType.IsHalfDay = true;
    incidentType = buildPresenceType(5, false, true);
    commentType = buildPresenceType(6, false, false);
    commentType.IsComment = true;

    presenceTypes = [
      absenceType,
      dispensationType,
      halfDayType,
      incidentType,
      commentType,
    ];
  });

  describe('.presenceCategory', () => {
    it('returns Present for no presence type', () => {
      entry = buildPresenceControlEntry(null);
      expect(entry.presenceCategory).toBe(PresenceCategory.Present);
    });

    it('returns Present for comment presence type', () => {
      entry = buildPresenceControlEntry(commentType);
      expect(entry.presenceCategory).toBe(PresenceCategory.Present);
    });

    it('returns Absent for absence type', () => {
      entry = buildPresenceControlEntry(absenceType);
      expect(entry.presenceCategory).toBe(PresenceCategory.Absent);
    });

    it('returns Absent for half day type', () => {
      entry = buildPresenceControlEntry(halfDayType);
      expect(entry.presenceCategory).toBe(PresenceCategory.Absent);
    });

    it('returns Absent for dispensation type', () => {
      entry = buildPresenceControlEntry(dispensationType);
      expect(entry.presenceCategory).toBe(PresenceCategory.Absent);
    });

    it('returns Present for other incident type', () => {
      entry = buildPresenceControlEntry(incidentType);
      expect(entry.presenceCategory).toBe(PresenceCategory.Present);
    });
  });

  describe('.nextPresenceCategory', () => {
    it('returns Present for no presence type', () => {
      entry = buildPresenceControlEntry(null);
      expect(entry.nextPresenceCategory).toBe(PresenceCategory.Absent);
    });

    it('returns Present for comment presence type', () => {
      entry = buildPresenceControlEntry(commentType);
      expect(entry.nextPresenceCategory).toBe(PresenceCategory.Absent);
    });

    it('returns Present for absence type', () => {
      entry = buildPresenceControlEntry(absenceType);
      expect(entry.nextPresenceCategory).toBe(PresenceCategory.Present);
    });

    it('returns Present for dispensation type', () => {
      entry = buildPresenceControlEntry(dispensationType);
      expect(entry.nextPresenceCategory).toBe(PresenceCategory.Present);
    });

    it('returns Present for half day type', () => {
      entry = buildPresenceControlEntry(halfDayType);
      expect(entry.nextPresenceCategory).toBe(PresenceCategory.Present);
    });

    it('returns Absent for incident type', () => {
      entry = buildPresenceControlEntry(incidentType);
      expect(entry.nextPresenceCategory).toBe(PresenceCategory.Absent);
    });
  });

  describe('.getNextPresenceType', () => {
    it('returns absence type for presence type', () => {
      entry = buildPresenceControlEntry(null);
      expect(entry.getNextPresenceType(presenceTypes)).toBe(absenceType);
    });

    it('returns presence type for absence type', () => {
      entry = buildPresenceControlEntry(absenceType);
      expect(entry.getNextPresenceType(presenceTypes)).toBeNull();
    });
  });

  function buildPresenceControlEntry(
    presenceType: Option<PresenceType>
  ): PresenceControlEntry {
    const presenceControlEntry = new PresenceControlEntry(
      buildLessonPresence(
        1,
        new Date(),
        new Date(),
        'Math',
        'Einstein Albert',
        presenceType ? presenceType.Id : undefined
      ),
      presenceType
    );

    Object.defineProperty(presenceControlEntry, 'settings', {
      // only returns odd die sides
      get: () => ({
        absencePresenceTypeId: absenceType.Id,
      }),
    });
    return presenceControlEntry;
  }
});
