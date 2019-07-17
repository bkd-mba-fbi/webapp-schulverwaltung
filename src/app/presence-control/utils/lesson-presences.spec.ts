import {
  buildPresenceType,
  buildLessonPresence,
  buildReference
} from 'src/spec-builders';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import {
  updatePresenceTypeForPresences,
  updateCommentForPresence
} from './lesson-presences';

describe('lesson presences utils', () => {
  let absent: PresenceType;
  let late: PresenceType;
  let comment: PresenceType;

  let turnenFrisch: LessonPresence;
  let deutschEinsteinAbwesend: LessonPresence;
  let deutschFrisch: LessonPresence;
  let deutschWalser: LessonPresence;
  let deutschCurrieAbwesend: LessonPresence;

  let presences: ReadonlyArray<LessonPresence>;
  let presenceTypes: ReadonlyArray<PresenceType>;

  beforeEach(() => {
    absent = buildPresenceType(11, 377, true, false);
    absent.Designation = 'Abwesend';

    late = buildPresenceType(12, 380, false, true);
    late.Designation = 'Verspätet';

    comment = buildPresenceType(13, 390, false, true);
    comment.IsComment = true;
    comment.Designation = null;

    turnenFrisch = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Turnen',
      'Frisch Max'
    );
    turnenFrisch.StudentRef = buildReference(10);
    turnenFrisch.PresenceTypeRef = null;

    deutschEinsteinAbwesend = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Einstein Albert',
      absent.Id
    );
    deutschEinsteinAbwesend.StudentRef = buildReference(20);
    deutschEinsteinAbwesend.PresenceType = absent.Designation;
    deutschEinsteinAbwesend.PresenceComment = 'e = mc^2';

    deutschFrisch = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Frisch Max'
    );
    deutschFrisch.StudentRef = buildReference(10);
    deutschFrisch.PresenceTypeRef = null;

    deutschWalser = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Walser Robert',
      comment.Id
    );
    deutschWalser.StudentRef = buildReference(30);
    deutschWalser.PresenceType = comment.Designation;
    deutschWalser.PresenceComment = 'Der Schlaf hat innere Augen.';

    deutschCurrieAbwesend = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Currie Marie',
      absent.Id
    );
    deutschCurrieAbwesend.StudentRef = buildReference(40);
    deutschCurrieAbwesend.PresenceType = absent.Designation;

    presences = [
      turnenFrisch,
      deutschEinsteinAbwesend,
      deutschFrisch,
      deutschWalser,
      deutschCurrieAbwesend
    ];

    presenceTypes = [absent, late, comment];
  });

  describe('updatePresenceTypeForPresences', () => {
    it('updates presence type attributes of existing lesson presences', () => {
      const result = updatePresenceTypeForPresences(
        presences,
        [
          { presence: deutschEinsteinAbwesend, newPresenceTypeId: null },
          { presence: deutschFrisch, newPresenceTypeId: late.Id },
          { presence: deutschCurrieAbwesend, newPresenceTypeId: null }
        ],
        presenceTypes
      );
      expect(result.length).toBe(5);

      expect(result[0]).toBe(turnenFrisch);

      expect(result[1].PresenceTypeRef).toEqual({
        Id: comment.Id,
        HRef: comment.Id.toString()
      });
      expect(result[1].PresenceType).toBeNull();
      expect(result[1].PresenceComment).toBe('e = mc^2');

      expect(result[2].PresenceTypeRef).toEqual({
        Id: late.Id,
        HRef: late.Id.toString()
      });
      expect(result[2].PresenceType).toBe('Verspätet');

      expect(result[3]).toBe(deutschWalser);

      expect(result[4].PresenceTypeRef).toBeNull();
      expect(result[4].PresenceType).toBeNull();
    });
  });

  describe('updateCommentForPresence', () => {
    it('updates comment of absent lesson presence', () => {
      const result = updateCommentForPresence(
        presences,
        deutschEinsteinAbwesend,
        'Heureka!',
        presenceTypes
      );
      expect(result.length).toBe(5);
      expect(result[0]).toBe(presences[0]);
      expect(result[2]).toBe(presences[2]);
      expect(result[3]).toBe(presences[3]);
      expect(result[4]).toBe(presences[4]);

      expect(result[1].PresenceComment).toBe('Heureka!');
      expect(result[1].PresenceType).toBe('Abwesend');
      expect(result[1].PresenceTypeRef).toEqual({
        Id: absent.Id,
        HRef: `/${absent.Id}`
      });
    });

    it('removes comment of absent lesson presence', () => {
      const result = updateCommentForPresence(
        presences,
        deutschEinsteinAbwesend,
        null,
        presenceTypes
      );
      expect(result.length).toBe(5);
      expect(result[0]).toBe(presences[0]);
      expect(result[2]).toBe(presences[2]);
      expect(result[3]).toBe(presences[3]);
      expect(result[4]).toBe(presences[4]);

      expect(result[1].PresenceComment).toBeNull();
      expect(result[1].PresenceType).toBe('Abwesend');
      expect(result[1].PresenceTypeRef).toEqual({
        Id: absent.Id,
        HRef: `/${absent.Id}`
      });
    });

    it('adds comment to present lesson presence', () => {
      const result = updateCommentForPresence(
        presences,
        deutschFrisch,
        'Meetings sind meist Zeiträuber.',
        presenceTypes
      );
      expect(result.length).toBe(5);
      expect(result[0]).toEqual(presences[0]);
      expect(result[1]).toEqual(presences[1]);
      expect(result[3]).toEqual(presences[3]);
      expect(result[4]).toEqual(presences[4]);

      expect(result[2].PresenceComment).toBe('Meetings sind meist Zeiträuber.');
      expect(result[2].PresenceType).toBeNull();
      expect(result[2].PresenceTypeRef).toEqual({
        Id: comment.Id,
        HRef: ''
      });
    });

    it('removes comment from present lesson presence', () => {
      const result = updateCommentForPresence(
        presences,
        deutschWalser,
        null,
        presenceTypes
      );
      expect(result.length).toBe(5);
      expect(result[0]).toEqual(presences[0]);
      expect(result[1]).toEqual(presences[1]);
      expect(result[2]).toEqual(presences[2]);
      expect(result[4]).toEqual(presences[4]);

      expect(result[3].PresenceComment).toBeNull();
      // expect(result[3].PresenceType).toBeNull();
      // expect(result[3].PresenceTypeRef).toBeNull();
    });
  });
});
