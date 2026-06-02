import { HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, ParamMap, convertToParamMap } from "@angular/router";
import { BehaviorSubject, firstValueFrom, of, throwError } from "rxjs";
import { buildAdditionalInformation, buildPerson } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { AdditionalInformation } from "../models/additional-informations.model";
import { PersonWithClassRegistration } from "../models/person.model";
import { AdditionalInformationsRestService } from "./additional-informations-rest.service";
import { CoursesRestService } from "./courses-rest.service";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { LoadingService } from "./loading-service";
import { StorageService } from "./storage.service";
import { StudentDossierEditService } from "./student-dossier-edit.service";
import { StudentStateService } from "./student-state.service";
import { SubscriptionsRestService } from "./subscriptions-rest.service";

describe("StudentDossierEditService", () => {
  let service: StudentDossierEditService;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let studentStateService: jasmine.SpyObj<StudentStateService>;
  let additionalInformationsService: jasmine.SpyObj<AdditionalInformationsRestService>;
  let dropDownItemsService: jasmine.SpyObj<DropDownItemsRestService>;
  let subscriptionsService: jasmine.SpyObj<SubscriptionsRestService>;
  let coursesService: jasmine.SpyObj<CoursesRestService>;
  let routeParams: BehaviorSubject<ParamMap>;
  let parentRouteParams: BehaviorSubject<ParamMap>;
  let additionalInformation: AdditionalInformation;
  let student$: BehaviorSubject<Option<PersonWithClassRegistration>>;

  beforeEach(() => {
    routeParams = new BehaviorSubject(convertToParamMap({ id: "1" }));
    parentRouteParams = new BehaviorSubject(convertToParamMap({ id: "42" }));

    activatedRoute = jasmine.createSpyObj<ActivatedRoute>(
      "ActivatedRoute",
      [],
      {
        paramMap: routeParams,
        parent: {
          paramMap: parentRouteParams,
        } as unknown as ActivatedRoute,
      },
    );

    student$ = new BehaviorSubject<Option<PersonWithClassRegistration>>({
      ...buildPerson(42),
      FullName: "Berger Laura",
      ClassRegistrations: [
        {
          Id: 1,
          IsActive: false,
          NumberStudyClass: "26a",
          DesignationStudyClass: "26a",
        },
        {
          Id: 2,
          IsActive: true,
          NumberStudyClass: "26c",
          DesignationStudyClass: "26c",
        },
        {
          Id: 3,
          IsActive: true,
          NumberStudyClass: "26d",
          DesignationStudyClass: "26d",
        },
      ],
    });

    studentStateService = jasmine.createSpyObj<StudentStateService>(
      "StudentStateService",
      [],
      {
        studentId$: of(42),
        student$,
      },
    );

    additionalInformationsService =
      jasmine.createSpyObj<AdditionalInformationsRestService>(
        "AdditionalInformationsRestService",
        ["get", "create", "update", "delete", "createWithFile"],
      );
    additionalInformation = buildAdditionalInformation();
    additionalInformationsService.get.and.returnValue(
      of(additionalInformation),
    );
    additionalInformationsService.create.and.returnValue(of(undefined));
    additionalInformationsService.update.and.returnValue(of(undefined));
    additionalInformationsService.delete.and.returnValue(of(undefined));
    additionalInformationsService.createWithFile.and.returnValue(of(undefined));

    dropDownItemsService = jasmine.createSpyObj<DropDownItemsRestService>(
      "DropDownItemsRestService",
      ["getAdditionalInformationCodes"],
    );
    dropDownItemsService.getAdditionalInformationCodes.and.returnValue(
      of([
        // Intentionally swap the ordering of the first two to test sorting
        {
          Key: 2000268,
          Value: "Ärztliches Attest",
          IsActive: true,
          Sort: "1011",
        },
        {
          Key: 2000267,
          Value: "Administration",
          IsActive: true,
          Sort: "1011",
        },
        {
          // Inactive
          Key: 2000271,
          Value: "Disziplinarisch",
          IsActive: false,
          Sort: "1011",
        },
        {
          // Other type
          Key: 2000272,
          Value: "Gesuch",
          IsActive: true,
          Sort: "0",
        },
      ]),
    );

    subscriptionsService = jasmine.createSpyObj<SubscriptionsRestService>(
      "SubscriptionsRestService",
      ["getSubscriptionIdsByStudent"],
    );
    subscriptionsService.getSubscriptionIdsByStudent.and.returnValue(
      of([
        { Id: 10, EventId: 11 },
        { Id: 20, EventId: 21 },
        { Id: 30, EventId: 31 },
      ]),
    );

    coursesService = jasmine.createSpyObj<CoursesRestService>(
      "CoursesRestService",
      ["getCourseIdsForDossier"],
    );
    coursesService.getCourseIdsForDossier.and.callFake((eventIds) =>
      of(
        eventIds.map((id) => ({
          Id: id,
          EventManagers: null,
        })),
      ),
    );

    const storageService = {
      getPayload() {
        return {
          id_person: 123,
        };
      },
    };

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          LoadingService,
          { provide: ActivatedRoute, useValue: activatedRoute },
          { provide: StudentStateService, useValue: studentStateService },
          {
            provide: AdditionalInformationsRestService,
            useValue: additionalInformationsService,
          },
          { provide: DropDownItemsRestService, useValue: dropDownItemsService },
          { provide: SubscriptionsRestService, useValue: subscriptionsService },
          { provide: CoursesRestService, useValue: coursesService },
          { provide: StorageService, useValue: storageService },
        ],
      }),
    );
    service = TestBed.inject(StudentDossierEditService);
  });

  describe("studentId$", () => {
    it("emits the student id from the route params", async () => {
      const studentId = await firstValueFrom(service.studentId$);
      expect(studentId).toBe(42);
    });
  });

  describe("studentName$", () => {
    it("emits the student name", async () => {
      const studentName = await firstValueFrom(service.studentName$);
      expect(studentName).toBe("Berger Laura");
    });
  });

  describe("additionalInformationId$", () => {
    it("emits null for new entry", async () => {
      routeParams.next(convertToParamMap({ id: "new" }));
      const additionalInformationId = await firstValueFrom(
        service.additionalInformationId$,
      );
      expect(additionalInformationId).toBeNull();
    });

    it("emits the ID for existing entries", async () => {
      const additionalInformationId = await firstValueFrom(
        service.additionalInformationId$,
      );
      expect(additionalInformationId).toBe(1);
    });
  });

  describe("additionalInformation$", () => {
    it("emits the additional information entry if it exists", async () => {
      const entry = await firstValueFrom(service.additionalInformation$);
      expect(entry).toBe(additionalInformation);
    });

    it("emits null for new entry", async () => {
      routeParams.next(convertToParamMap({ id: "new" }));
      const entry = await firstValueFrom(service.additionalInformation$);
      expect(entry).toBeNull();
    });

    it("emits null if the response is a 404", async () => {
      const error = new HttpErrorResponse({ status: 404 });
      additionalInformationsService.get.and.returnValue(
        throwError(() => error),
      );

      const entry = await firstValueFrom(service.additionalInformation$);
      expect(entry).toBeNull();
    });
  });

  describe("categories$", () => {
    it("emits active, sorted categories of type 1011", async () => {
      const categories = await firstValueFrom(service.categories$);
      expect(categories).toEqual([
        {
          Key: 2000267,
          Value: "Administration",
          IsActive: true,
          Sort: "1011",
        },
        {
          Key: 2000268,
          Value: "Ärztliches Attest",
          IsActive: true,
          Sort: "1011",
        },
      ]);
    });
  });

  describe("getClassTeacherObject", () => {
    it("returns the ID of the subscription of the student that is managed by the current user", async () => {
      coursesService.getCourseIdsForDossier.and.callFake((eventIds) =>
        of(
          eventIds.map((id) => ({
            Id: id,
            EventManagers:
              id === 21
                ? [{ Id: 1, PersonId: 123, Firstname: "Jane", Lastname: "Doe" }]
                : null,
          })),
        ),
      );

      const id = await service.getClassTeacherObject(42);
      expect(id).toEqual({ objectId: 20 });
    });

    it("returns the ID of a single class registration if no subscription is available", async () => {
      coursesService.getCourseIdsForDossier.and.callFake((eventIds) =>
        of(
          eventIds.map((id) => ({
            Id: id,
            EventManagers:
              id === 21
                ? [{ Id: 1, PersonId: 321, Firstname: "Jane", Lastname: "Doe" }]
                : null,
          })),
        ),
      );
      student$.next({
        ...buildPerson(42),
        ClassRegistrations: [
          {
            Id: 1,
            IsActive: false,
            NumberStudyClass: "26a",
            DesignationStudyClass: "26a",
          },
          {
            Id: 2,
            IsActive: true,
            NumberStudyClass: "26c",
            DesignationStudyClass: "26c",
          },
        ],
      });

      const id = await service.getClassTeacherObject(42);
      expect(id).toEqual({ objectId: 2 });
    });

    it("returns an option for every class registration if no subscription is available", async () => {
      coursesService.getCourseIdsForDossier.and.callFake((eventIds) =>
        of(
          eventIds.map((id) => ({
            Id: id,
            EventManagers:
              id === 21
                ? [{ Id: 1, PersonId: 321, Firstname: "Jane", Lastname: "Doe" }]
                : null,
          })),
        ),
      );

      const id = await service.getClassTeacherObject(42);
      expect(id).toEqual({
        objectOptions: [
          { Key: 2, Value: "26c" },
          { Key: 3, Value: "26d" },
        ],
      });
    });
  });

  describe("save", () => {
    describe("note", () => {
      describe("new entry", () => {
        it("creates an entry", async () => {
          const entry = additionalInformation as Partial<AdditionalInformation>;
          delete entry.Id;
          await service.save("note", entry, null);
          expect(additionalInformationsService.create).toHaveBeenCalledWith(
            entry,
            jasmine.any(Object),
          );
          expect(
            additionalInformationsService.createWithFile,
          ).not.toHaveBeenCalled();
        });
      });

      describe("existing entry", () => {
        it("updates an entry", async () => {
          const entry = additionalInformation;
          await service.save("note", entry, null);
          expect(additionalInformationsService.update).toHaveBeenCalledWith(
            entry,
            jasmine.any(Object),
          );
          expect(
            additionalInformationsService.createWithFile,
          ).not.toHaveBeenCalled();
        });
      });
    });

    describe("document", () => {
      describe("new entry", () => {
        it("creates a file entry", async () => {
          const entry = additionalInformation as Partial<AdditionalInformation>;
          delete entry.Id;
          const file = new File([], "test.pdf");
          await service.save("document", entry, file);
          expect(
            additionalInformationsService.createWithFile,
          ).toHaveBeenCalledWith(entry, file, "test.pdf");
          expect(additionalInformationsService.create).not.toHaveBeenCalled();
        });

        it("throws an error if file is not present", async () => {
          const entry = additionalInformation as Partial<AdditionalInformation>;
          delete entry.Id;
          await expectAsync(
            service.save("document", entry, null),
          ).toBeRejectedWithError("File is not present");
          expect(
            additionalInformationsService.createWithFile,
          ).not.toHaveBeenCalled();
          expect(additionalInformationsService.create).not.toHaveBeenCalled();
        });
      });

      describe("existing entry", () => {
        it("updates entry, but without the file field", async () => {
          const entry = additionalInformation as Pick<
            AdditionalInformation,
            "Id"
          > &
            Partial<Omit<AdditionalInformation, "Id">>;
          await service.save("document", entry, null);
          expect(additionalInformationsService.update).toHaveBeenCalledWith(
            entry,
            jasmine.any(Object),
          );
          expect(additionalInformationsService.create).not.toHaveBeenCalled();
          expect(
            additionalInformationsService.createWithFile,
          ).not.toHaveBeenCalled();
        });

        it("throws an error if file is present", async () => {
          const entry = additionalInformation as Pick<
            AdditionalInformation,
            "Id"
          > &
            Partial<Omit<AdditionalInformation, "Id">>;
          const file = new File([], "test.pdf");
          await expectAsync(
            service.save("document", entry, file),
          ).toBeRejectedWithError("File update is not supported");
          expect(additionalInformationsService.update).not.toHaveBeenCalled();
          expect(additionalInformationsService.create).not.toHaveBeenCalled();
          expect(
            additionalInformationsService.createWithFile,
          ).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("delete", () => {
    it("deletes the entry", async () => {
      await service.delete(123);
      expect(additionalInformationsService.delete).toHaveBeenCalledWith(123);
    });
  });
});
