import { HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, ParamMap, convertToParamMap } from "@angular/router";
import { BehaviorSubject, firstValueFrom, of, throwError } from "rxjs";
import {
  buildAdditionalInformation,
  buildStudent,
  buildSubscription,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { AdditionalInformation } from "../models/additional-informations.model";
import { AdditionalInformationsRestService } from "./additional-informations-rest.service";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { LoadingService } from "./loading-service";
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
  let routeParams: BehaviorSubject<ParamMap>;
  let parentRouteParams: BehaviorSubject<ParamMap>;
  let additionalInformation: AdditionalInformation;

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

    studentStateService = jasmine.createSpyObj<StudentStateService>(
      "StudentStateService",
      [],
      {
        studentId$: of(42),
        student$: of({ ...buildStudent(42), ClassRegistrations: [] }),
      },
    );

    additionalInformationsService =
      jasmine.createSpyObj<AdditionalInformationsRestService>(
        "AdditionalInformationsRestService",
        ["get", "create", "createWithFile"],
      );
    additionalInformation = buildAdditionalInformation();
    additionalInformationsService.get.and.returnValue(
      of(additionalInformation),
    );
    additionalInformationsService.create.and.returnValue(of(undefined));
    additionalInformationsService.createWithFile.and.returnValue(of(undefined));

    dropDownItemsService = jasmine.createSpyObj<DropDownItemsRestService>(
      "DropDownItemsRestService",
      ["getAdditionalInformationCodes"],
    );
    dropDownItemsService.getAdditionalInformationCodes.and.returnValue(
      of([
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
      ["getList"],
    );
    subscriptionsService.getList.and.returnValue(
      of([buildSubscription(10, 11, 12), buildSubscription(20, 21, 22)]),
    );

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
      expect(studentName).toBe("T. Tux");
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
    it("emits active categories of type 1011", async () => {
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

  describe("getSubscriptionId", () => {
    it("returns the ID of the first subscription of the student", async () => {
      const id = await service.getSubscriptionId(42);
      expect(id).toBe(10);
      expect(subscriptionsService.getList).toHaveBeenCalledWith({
        params: {
          "filter.IsOkay": "=1",
          "filter.PersonId": "=42",
        },
      });
    });
  });

  describe("save", () => {
    describe("note", () => {
      it("creates an entry", async () => {
        await service.save("note", additionalInformation, null);
        expect(additionalInformationsService.create).toHaveBeenCalledWith(
          additionalInformation,
          jasmine.any(Object),
        );
        expect(
          additionalInformationsService.createWithFile,
        ).not.toHaveBeenCalled();
      });
    });

    describe("document", () => {
      it("creates a file entry", async () => {
        const file = new File([], "test.pdf");
        await service.save("document", additionalInformation, file);
        expect(
          additionalInformationsService.createWithFile,
        ).toHaveBeenCalledWith(additionalInformation, file, "test.pdf");
        expect(additionalInformationsService.create).not.toHaveBeenCalled();
      });

      it("throws an error if file is not present", async () => {
        await expectAsync(
          service.save("document", additionalInformation, null),
        ).toBeRejectedWithError("File is not present");
        expect(
          additionalInformationsService.createWithFile,
        ).not.toHaveBeenCalled();
        expect(additionalInformationsService.create).not.toHaveBeenCalled();
      });
    });
  });
});
