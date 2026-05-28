import { HttpContext } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  Observable,
  firstValueFrom,
  map,
  of,
  shareReplay,
  switchMap,
} from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { RestErrorInterceptorOptions } from "src/app/shared/interceptors/rest-error.interceptor";
import {
  AdditionalInformation,
  AdditionalInformationCode,
} from "src/app/shared/models/additional-informations.model";
import { AdditionalInformationsRestService } from "src/app/shared/services/additional-informations-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { catch404 } from "src/app/shared/utils/observable";
import { CourseIdWithEventManagers } from "../models/course.model";
import { ClassRegistration } from "../models/student.model";
import { Subscription } from "../models/subscription.model";
import { isAllowedDossierCategory } from "../utils/additional-informations";
import { UnreachableError } from "../utils/error";
import { notNull } from "../utils/filter";
import { CoursesRestService } from "./courses-rest.service";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { StorageService } from "./storage.service";
import { StudentStateService } from "./student-state.service";
import { SubscriptionsRestService } from "./subscriptions-rest.service";

@Injectable({
  providedIn: "root",
})
export class StudentDossierEditService {
  private route = inject(ActivatedRoute);
  private studentState = inject(StudentStateService);
  private additionalInformationsService = inject(
    AdditionalInformationsRestService,
  );
  private dropDownItemsService = inject(DropDownItemsRestService);
  private subscriptionsService = inject(SubscriptionsRestService);
  private coursesService = inject(CoursesRestService);
  private loadingService = inject(LoadingService);
  private settings = inject<Settings>(SETTINGS);
  private storageService = inject(StorageService);

  loading$ = this.loadingService.loading$;
  studentId$ = this.studentState.studentId$;
  studentName$ = this.studentState.student$.pipe(
    map((student) => student?.FullName ?? null),
  );
  additionalInformationId$ = this.route.paramMap.pipe(
    map((params) => {
      const id = params.get("id");
      return id === "new" ? null : Number(id);
    }),
  );
  additionalInformation$ = this.additionalInformationId$.pipe(
    switchMap(this.loadAdditionalInformation.bind(this)),
    shareReplay(1),
  );
  categories$ = this.loadCategories().pipe(shareReplay(1));

  /**
   * In case of visibility for class teachers only, returns either the
   * `objectId` the new entry can be associated with or a list of possible
   * objects the user can choose from if there are multiple options.
   */
  async getClassTeacherObject(studentId: number): Promise<
    | {
        objectId: Option<number>;
        objectOptions?: undefined;
      }
    | {
        objectId?: undefined;
        objectOptions: ReadonlyArray<{ Key: number; Value: string }>;
      }
  > {
    const subscriptionId = await this.getSubscriptionId(studentId);
    if (subscriptionId) {
      // Subscription of a course the current user manages found
      return { objectId: subscriptionId };
    }

    // No subscriptions of a course the current user manages found (this is
    // typically the case for class teachers without a course or for the
    // principal/Schulleitung), so the entry has to be attached to the class
    // registration.
    const classRegistrations = await this.getClassRegistrations();
    if (classRegistrations.length === 0) {
      // No subscription and no class found, should not happen
      return { objectId: null };
    }
    if (classRegistrations.length === 1) {
      // Single class registrations, so we can use this as objectId
      return { objectId: classRegistrations[0].Id };
    }

    // Multiple class registrations, user has to choose
    const objectOptions = classRegistrations.map((r) => ({
      Key: r.Id,
      Value: r.DesignationStudyClass,
    }));
    return {
      objectOptions,
    };
  }

  async save(
    type: "document" | "note",
    entry: Partial<AdditionalInformation>,
    file: Option<File>,
  ): Promise<void> {
    if (entry.Id) {
      return this.update(
        type,
        entry as Pick<AdditionalInformation, "Id"> &
          Partial<Omit<AdditionalInformation, "Id">>,
        file,
      );
    }
    return this.create(type, entry, file);
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.additionalInformationsService.delete(id));
  }

  /**
   * Fetches and returns the subscription ID of a course that is managed by the
   * current user (i.e. the user is teacher of) or null if not available.
   */
  private async getSubscriptionId(studentId: number): Promise<Option<number>> {
    return firstValueFrom(
      this.subscriptionsService.getSubscriptionIdsByStudent(studentId).pipe(
        switchMap((subscriptions) => {
          const eventIds = subscriptions.map((s) => s.EventId).filter(notNull);
          return this.coursesService
            .getCourseIdsForDossier(eventIds)
            .pipe(
              map((courseIdsWithEventManagers) =>
                this.getSubscriptionIdOfManagedCourse(
                  subscriptions,
                  courseIdsWithEventManagers,
                ),
              ),
            );
        }),
      ),
    );
  }

  /**
   * Returns the ID of the first subscription that is assigned to a course the
   * current user manages (i.e. is teacher of) or null if not available.
   */
  private getSubscriptionIdOfManagedCourse(
    subscriptions: ReadonlyArray<Pick<Subscription, "Id" | "EventId">>,
    courses: ReadonlyArray<CourseIdWithEventManagers>,
  ): Option<number> {
    const userId = Number(this.storageService.getPayload()?.id_person);
    if (!userId) return null;

    const managedCourseIds = courses
      .filter((c) => c.EventManagers?.some((m) => m.PersonId === userId))
      .map((c) => c.Id);
    const subsOfManagedCourses = subscriptions.filter(
      (s) => s.EventId && managedCourseIds.includes(s.EventId),
    );
    return subsOfManagedCourses[0]?.Id ?? null;
  }

  private async getClassRegistrations(): Promise<
    ReadonlyArray<ClassRegistration>
  > {
    return firstValueFrom(
      this.studentState.student$.pipe(
        map(
          (student) =>
            student?.ClassRegistrations?.filter((r) => r.IsActive) ?? [],
        ),
      ),
    );
  }

  private async create(
    type: "document" | "note",
    entry: Partial<AdditionalInformation>,
    file: Option<File>,
  ): Promise<void> {
    let save$: Observable<void>;
    switch (type) {
      case "document":
        if (!file) {
          throw new Error("File is not present");
        }
        save$ = this.additionalInformationsService.createWithFile(
          entry,
          file,
          file.name,
        );
        break;
      case "note":
        save$ = this.additionalInformationsService.create(entry, {
          context: new HttpContext().set(RestErrorInterceptorOptions, {
            disableErrorHandling: true,
          }),
        });
        break;
      default:
        throw new UnreachableError(type, "Unhandled type");
    }
    await firstValueFrom(save$);
  }

  private async update(
    _type: "document" | "note",
    entry: Pick<AdditionalInformation, "Id"> &
      Partial<Omit<AdditionalInformation, "Id">>,
    file: Option<File>,
  ): Promise<void> {
    const id = entry.Id;
    if (!id) {
      throw new Error("Entry ID is not present");
    }
    if (file) {
      throw new Error("File update is not supported");
    }
    const save$ = this.additionalInformationsService.update(entry, {
      context: new HttpContext().set(RestErrorInterceptorOptions, {
        disableErrorHandling: true,
      }),
    });
    await firstValueFrom(save$);
  }

  private loadCategories(): Observable<
    ReadonlyArray<AdditionalInformationCode>
  > {
    return this.loadingService.load(
      this.dropDownItemsService.getAdditionalInformationCodes().pipe(
        map((categories) =>
          categories.filter((category) =>
            isAllowedDossierCategory(category, this.settings),
          ),
        ),
        map((categories) =>
          [...categories].sort((a, b) => a.Value.localeCompare(b.Value)),
        ),
      ),
    );
  }

  private loadAdditionalInformation(
    additionalInformationId: Option<number>,
  ): Observable<Option<AdditionalInformation>> {
    if (!additionalInformationId) return of(null);

    return this.loadingService.load(
      this.additionalInformationsService
        .get(additionalInformationId, {
          context: new HttpContext().set(RestErrorInterceptorOptions, {
            disableErrorHandlingForStatus: [404],
          }),
        })
        .pipe(catch404()),
    );
  }
}
