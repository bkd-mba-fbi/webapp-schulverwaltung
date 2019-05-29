import {
  buildPresenceType,
  buildLessonPresence,
  buildReference
} from 'src/spec-builders';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { updatePresenceTypeForPresences } from './lesson-presences';

describe('lesson presences utils', () => {
  let absent: PresenceType;
  let late: PresenceType;

  let turnenFrisch: LessonPresence;
  let deutschEinsteinAbwesend: LessonPresence;
  let deutschFrisch: LessonPresence;
  let deutschWalser: LessonPresence;

  beforeEach(() => {
    absent = buildPresenceType(11, 377, 1, 0);
    late = buildPresenceType(12, 380, 0, 1);
    late.Designation = 'Verspätet';

    turnenFrisch = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Turnen',
      'Frisch Max'
    );
    turnenFrisch.StudentRef = buildReference(10);

    deutschEinsteinAbwesend = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Einstein Albert',
      absent.Id
    );
    deutschEinsteinAbwesend.StudentRef = buildReference(20);
    deutschEinsteinAbwesend.PresenceComment = 'e = mc^2';

    deutschFrisch = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Frisch Max'
    );
    deutschFrisch.StudentRef = buildReference(10);

    deutschWalser = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Walser Robert'
    );
    deutschWalser.StudentRef = buildReference(30);
  });

  describe('updatePresenceTypeForPresences', () => {
    it('updates presence type attributes of existing lesson presences', () => {
      const result = updatePresenceTypeForPresences(
        [turnenFrisch, deutschEinsteinAbwesend, deutschFrisch, deutschWalser],
        [
          { presence: deutschEinsteinAbwesend, newPresenceTypeId: null },
          { presence: deutschFrisch, newPresenceTypeId: late.Id }
        ],
        [absent, late]
      );
      expect(result.length).toBe(4);
      expect(result[0]).toBe(turnenFrisch);

      expect(result[1].PresenceTypeRef).toBeNull();
      expect(result[1].PresenceType).toBeNull();
      expect(result[1].PresenceComment).toBe('e = mc^2');

      expect(result[2].PresenceTypeRef).toEqual({ Id: late.Id, Href: '' });
      expect(result[2].PresenceType).toBe('Verspätet');

      expect(result[3]).toBe(deutschWalser);
    });
  });
});
