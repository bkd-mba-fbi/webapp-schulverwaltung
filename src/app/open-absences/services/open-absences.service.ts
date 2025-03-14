import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  merge,
} from "rxjs";
import { map, shareReplay, take } from "rxjs/operators";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { LessonPresencesRestService } from "src/app/shared/services/lesson-presences-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { SortService } from "src/app/shared/services/sort.service";
import { IConfirmAbsencesService } from "src/app/shared/tokens/confirm-absences-service";
import { spread } from "src/app/shared/utils/function";
import { searchEntries } from "src/app/shared/utils/search";
import { Person } from "../../shared/models/person.model";
import { toDesignationDateTimeTypeString } from "../../shared/utils/lesson-presences";
import { OpenAbsencesEntry } from "../models/open-absences-entry.model";
import {
  buildOpenAbsencesEntries,
  removeOpenAbsences,
  sortOpenAbsencesEntries,
} from "../utils/open-absences-entries";

export const SORT_KEYS = ["name", "date"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

const SEARCH_FIELDS: ReadonlyArray<keyof OpenAbsencesEntry> = [
  "studentFullName",
  "studyClassNumber",
];

@Injectable()
export class OpenAbsencesService implements IConfirmAbsencesService {
  private translate = inject(TranslateService);
  private lessonPresencesService = inject(LessonPresencesRestService);
  private selectionService = inject(ConfirmAbsencesSelectionService);
  private sortService = inject<SortService<SortKey>>(SortService);
  private loadingService = inject(LoadingService);

  loading$ = this.loadingService.loading$;
  search$ = new BehaviorSubject<string>("");

  private updateUnconfirmedAbsences$ = new Subject<
    ReadonlyArray<LessonPresence>
  >();
  private unconfirmedAbsences$ = merge(
    this.loadUnconfirmedAbsences(),
    this.updateUnconfirmedAbsences$,
  ).pipe(shareReplay(1));
  private entries$ = this.unconfirmedAbsences$.pipe(
    map(buildOpenAbsencesEntries),
    shareReplay(1),
  );

  sortCriteria = this.sortService.sortCriteria;
  sortedEntries$ = combineLatest([
    this.entries$,
    this.sortService.sortCriteria$,
  ]).pipe(map(spread(sortOpenAbsencesEntries)));

  filteredEntries$ = combineLatest([this.sortedEntries$, this.search$]).pipe(
    map(([entries, term]) => searchEntries(entries, SEARCH_FIELDS, term)),
    shareReplay(1),
  );

  currentDetail: Option<{ date: string; personId: number }> = null;

  constructor() {
    this.sortService.sortCriteria.set({
      primarySortKey: "date",
      ascending: false,
    });
  }

  getUnconfirmedAbsences(
    dateString: string,
    studentId: number,
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.entries$.pipe(
      map((entries) => {
        const entry = entries.find(
          (e) => e.dateString === dateString && e.studentId === studentId,
        );
        return entry ? entry.absences : [];
      }),
    );
  }

  getAllUnconfirmedAbsencesForStudent(
    studentId: number,
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.entries$.pipe(
      map((entries) => {
        return entries
          .filter((e) => e.studentId === studentId)
          .reduce((a: LessonPresence[], e) => a.concat(e.absences), []);
      }),
    );
  }

  get confirmBackLink(): Parameters<Router["navigate"]>[0] {
    if (this.currentDetail) {
      return [
        "/open-absences/detail",
        this.currentDetail.personId,
        this.currentDetail.date,
      ];
    }
    return ["/open-absences"];
  }

  /**
   * Removes selected entries from unconfirmed absences and cleans
   * selection.
   */
  updateAfterConfirm(): void {
    combineLatest([
      this.unconfirmedAbsences$.pipe(take(1)),
      this.selectionService.selectedIds$.pipe(take(1)),
    ])
      .pipe(map(spread(removeOpenAbsences)))
      .subscribe((unconfirmedAbsences) => {
        this.selectionService.clear();
        this.updateUnconfirmedAbsences$.next(unconfirmedAbsences);
      });
  }

  /**
   * Returns a mailto string in the following format: <email>?subject=<subject>&body=<body>
   *
   * The email is addressed to the given person and contains a list of their open absences
   * in the body content. The senders's default language is used to translate the content.
   */
  buildMailToString(
    person: Person,
    absences: ReadonlyArray<LessonPresence>,
  ): string {
    const address = person.Email;
    const subject = this.translate.instant("open-absences.detail.mail.subject");
    const formattedAbsences = absences
      .map((absence) => toDesignationDateTimeTypeString(absence))
      .join("%0D%0A");

    let body = `${this.translate.instant(
      "open-absences.detail.mail.body",
    )}%0D%0A${formattedAbsences}`;

    if (body.length >= 1600) {
      body = `${body.substring(0, 1500)}%0D%0A${this.translate.instant(
        "open-absences.detail.mail.bodyToLargeForEmailTo",
      )}`;
    }

    return `${address}?subject=${subject}&body=${body}`;
  }

  private loadUnconfirmedAbsences(): Observable<ReadonlyArray<LessonPresence>> {
    return this.loadingService.load(
      this.lessonPresencesService.getListOfUnconfirmed(),
    );
  }
}
