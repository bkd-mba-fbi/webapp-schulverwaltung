import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import {
  buildLessonPresence,
  buildPresenceType,
  buildReference,
} from 'src/spec-builders';
import { settings } from 'src/spec-helpers';
import { updatePresenceTypeForPresences } from './lesson-presences';

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
    absent = buildPresenceType(11, true, false);
    absent.Designation = 'Abwesend';

    late = buildPresenceType(12, false, true);
    late.Designation = 'Verspätet';

    comment = buildPresenceType(13, false, true);
    comment.IsComment = true;
    comment.Designation = null;

    turnenFrisch = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Turnen',
      'Frisch Max',
    );
    turnenFrisch.StudentRef = buildReference(10);
    turnenFrisch.TypeRef = { Id: null, HRef: null };

    deutschEinsteinAbwesend = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Einstein Albert',
      'Dora Durrer',
      absent.Id,
    );
    deutschEinsteinAbwesend.StudentRef = buildReference(20);
    deutschEinsteinAbwesend.Type = absent.Designation;
    deutschEinsteinAbwesend.Comment = 'e = mc^2';

    deutschFrisch = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Frisch Max',
    );
    deutschFrisch.StudentRef = buildReference(10);
    deutschFrisch.TypeRef = { Id: null, HRef: null };

    deutschWalser = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Walser Robert',
      'Dora Durrer',
      comment.Id,
    );
    deutschWalser.StudentRef = buildReference(30);
    deutschWalser.Type = comment.Designation;
    deutschWalser.Comment = 'Der Schlaf hat innere Augen.';

    deutschCurrieAbwesend = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Currie Marie',
      'Dora Durrer',
      absent.Id,
    );
    deutschCurrieAbwesend.StudentRef = buildReference(40);
    deutschCurrieAbwesend.Type = absent.Designation;

    presences = [
      turnenFrisch,
      deutschEinsteinAbwesend,
      deutschFrisch,
      deutschWalser,
      deutschCurrieAbwesend,
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
          { presence: deutschCurrieAbwesend, newPresenceTypeId: null },
        ],
        presenceTypes,
        settings,
      );
      expect(result.length).toBe(5);

      expect(result[0]).toBe(turnenFrisch);

      expect(result[1].TypeRef).toEqual({
        Id: comment.Id,
        HRef: null,
      });
      expect(result[1].Type).toBeNull();
      expect(result[1].Comment).toBe('e = mc^2');

      expect(result[2].TypeRef).toEqual({
        Id: late.Id,
        HRef: null,
      });
      expect(result[2].Type).toBe('Verspätet');

      expect(result[3]).toBe(deutschWalser);

      expect(result[4].TypeRef).toEqual({ Id: null, HRef: null });
      expect(result[4].Type).toBeNull();
    });
  });
});
