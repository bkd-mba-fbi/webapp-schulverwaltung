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
import { UnreachableError } from "../utils/error";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
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
  private loadingService = inject(LoadingService);
  private settings = inject<Settings>(SETTINGS);

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

  async getSubscriptionId(studentId: number): Promise<Option<number>> {
    const subscriptions = await firstValueFrom(
      this.subscriptionsService.getList({
        params: {
          "filter.IsOkay": "=1",
          "filter.PersonId": `=${studentId}`,
        },
      }),
    );
    return subscriptions[0]?.Id ?? null;
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
    type: "document" | "note",
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
          categories.filter(
            (category) =>
              category.IsActive &&
              // As a workaround, the type id of the category is in the `Sort`
              // field. Use this to exclude duplicate categories.
              category.Sort === String(this.settings.dossierCategoriesTypeId),
          ),
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
