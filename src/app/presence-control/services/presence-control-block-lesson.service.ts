import { Inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, take } from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceControlEntry } from '../models/presence-control-entry.model';
import { getPresenceControlEntry } from '../utils/lessons';
import { PresenceControlStateService } from './presence-control-state.service';
import { canChangePresenceType } from '../utils/presence-types';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';

const MAX_BLOCK_LESSION_MINUTES_GAP = 30;

export function getBlockLessonLoadingContext(
  entry: PresenceControlEntry,
): string {
  return `blockLesson${entry.lessonPresence.Id}`;
}

@Injectable()
export class PresenceControlBlockLessonService {
  constructor(
    private state: PresenceControlStateService,
    private lessonPresencesService: LessonPresencesRestService,
    private loadingService: LoadingService,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  /**
   * A block lesson is defined as a set of lesson presences of the
   * same day/student/teacher/class and not more than half an hour
   * apart.
   *
   * Returns an array of presence control entries that are part of the
   * same block lesson as the given entry. Does not contain entries
   * for which the presence type cannot be updated.
   */
  getBlockLessonPresenceControlEntries(
    entry: PresenceControlEntry,
  ): Observable<ReadonlyArray<PresenceControlEntry>> {
    return combineLatest([
      this.state.lessons$.pipe(take(1)),
      this.loadChangeableLessonPresences(entry),
      this.state.presenceTypes$.pipe(take(1)),
      this.state.absenceConfirmationStates$.pipe(take(1)),
      this.state.otherTeachersAbsences$.pipe(take(1)),
    ]).pipe(
      map(
        ([
          lessons,
          presences,
          types,
          confirmationStates,
          otherTeachersAbsences,
        ]) => {
          return this.filterBlockLessonPresences(entry, presences).map(
            (presence) =>
              getPresenceControlEntry(
                lessons.find(
                  (lesson) => lesson.id === presence.LessonRef.Id.toString(),
                ),
                presence,
                types,
                confirmationStates,
                otherTeachersAbsences,
              ),
          );
        },
      ),
    );
  }

  /**
   * Returns the lesson presences that are part of the same block lesson as entry.
   */
  private filterBlockLessonPresences(
    entry: PresenceControlEntry,
    lessonPresences: ReadonlyArray<LessonPresence>,
  ): ReadonlyArray<LessonPresence> {
    return [...lessonPresences]
      .sort((a, b) => (a.LessonDateTimeFrom > b.LessonDateTimeFrom ? 1 : -1))
      .reduce((blockLessons, presence) => {
        const previousPresence = blockLessons[blockLessons.length - 1];
        if (this.isWithinBlockTime(presence, previousPresence)) {
          blockLessons.push(presence);
          return blockLessons;
        }
        return blockLessons.find((bl) => bl.Id === entry.lessonPresence.Id)
          ? blockLessons
          : [presence];
      }, [] as Array<LessonPresence>);
  }

  /**
   * Lesson presences that are apart half an hour or less are
   * considered as part of the same block lesson.
   */
  private isWithinBlockTime(
    presence: LessonPresence,
    previousPresence: LessonPresence,
  ): boolean {
    if (!previousPresence) {
      return true;
    }

    return (
      presence.LessonDateTimeFrom.getTime() -
        previousPresence.LessonDateTimeTo.getTime() <=
      MAX_BLOCK_LESSION_MINUTES_GAP * 60 * 1000
    );
  }

  /**
   * Returns the changeable lesson presences, relevant to determine block lessons.
   */
  private loadChangeableLessonPresences(
    entry: PresenceControlEntry,
  ): Observable<ReadonlyArray<LessonPresence>> {
    return combineLatest([
      // To determine the block lessons, it is important to fetch all
      // presences of the day, since the state service loads only the
      // presences of the selected lesson
      this.loadLessonPresences(entry),
      this.state.presenceTypes$.pipe(take(1)),
    ]).pipe(
      map(([presences, types]) =>
        presences.filter((presence) =>
          canChangePresenceType(
            presence,
            types.find((t) => t.Id === presence.TypeRef.Id) || null,
            this.settings,
          ),
        ),
      ),
    );
  }

  /**
   * Returns all lesson presences of same day/student/teacher/class.
   */
  private loadLessonPresences(
    entry: PresenceControlEntry,
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.loadingService.load(
      this.lessonPresencesService
        .getListByDateStudentClass(
          entry.lessonPresence.LessonDateTimeFrom,
          entry.lessonPresence.StudentRef.Id,
          entry.lessonPresence.StudyClassRef.Id ?? undefined,
        )
        .pipe(
          map((presences) =>
            presences.filter(
              (presence) =>
                presence.TeacherInformation ===
                entry.lessonPresence.TeacherInformation,
            ),
          ),
        ),
      getBlockLessonLoadingContext(entry),
    );
  }
}
