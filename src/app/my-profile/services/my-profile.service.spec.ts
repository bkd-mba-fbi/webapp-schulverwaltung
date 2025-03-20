import { HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { Person } from "src/app/shared/models/person.model";
import { StorageService } from "src/app/shared/services/storage.service";
import {
  Apprenticeship,
  StudentProfileService,
} from "src/app/shared/services/student-profile.service";
import {
  buildApprenticeshipContract,
  buildApprenticeshipManager,
  buildJobTrainer,
  buildPerson,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyProfileService } from "./my-profile.service";

describe("MyProfileService", () => {
  let service: MyProfileService;
  let roles: string;
  let myself: Person;
  let studentProfileServiceMock: jasmine.SpyObj<StudentProfileService>;

  beforeEach(() => {
    roles = "StudentRole";

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          MyProfileService,
          {
            provide: StudentProfileService,
            useFactory() {
              studentProfileServiceMock = jasmine.createSpyObj(
                "StudentProfileService",
                [
                  "getMyself",
                  "getLegalRepresentatives",
                  "getApprenticeships",
                  "getStayPermitValue",
                ],
              );

              myself = buildPerson(123);
              studentProfileServiceMock.getMyself.and.returnValue(of(myself));
              studentProfileServiceMock.getLegalRepresentatives.and.returnValue(
                of([]),
              );
              studentProfileServiceMock.getApprenticeships.and.returnValue(
                of([]),
              );
              studentProfileServiceMock.getStayPermitValue.and.returnValue(
                of(null),
              );

              return studentProfileServiceMock;
            },
          },
          {
            provide: StorageService,
            useValue: { getPayload: () => ({ roles }) },
          },
        ],
      }),
    );
    service = TestBed.inject(MyProfileService);
  });

  describe("person$", () => {
    it("emits person", (done) => {
      myself = buildPerson(123);
      studentProfileServiceMock.getMyself.and.returnValue(of(myself));
      service.person$.subscribe((person) => {
        expect(person).toEqual(myself);
        done();
      });
    });

    it("emits null for substitutions where person is not available/accessible", (done) => {
      studentProfileServiceMock.getMyself.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 403 })),
      );
      service.person$.subscribe((person) => {
        expect(person).toEqual(null);
        done();
      });
    });

    it("reloads & emits new person when reloadStudent is called", () => {
      const callback = jasmine.createSpy("callback");
      service.person$.subscribe(callback);
      expect(callback).toHaveBeenCalledOnceWith(myself);

      callback.calls.reset();
      const newMyself = buildPerson(123);
      newMyself.AddressLine1 = "Abbey road";
      studentProfileServiceMock.getMyself.and.returnValue(of(newMyself));

      service.reloadStudent();
      expect(callback).toHaveBeenCalledOnceWith(newMyself);
    });
  });

  describe("legalRepresentatives$", () => {
    let legalReps: ReadonlyArray<Person>;
    beforeEach(() => {
      legalReps = [buildPerson(123)];
      studentProfileServiceMock.getLegalRepresentatives.and.returnValue(
        of(legalReps),
      );
    });

    describe("student", () => {
      beforeEach(() => {
        roles = "StudentRole";
      });

      it("emits legal representatives", (done) => {
        service.legalRepresentatives$.subscribe((result) => {
          expect(result).toEqual(legalReps);
          done();
        });
      });
    });

    describe("teacher", () => {
      beforeEach(() => {
        roles = "TeacherRole";
      });

      it("emits null", (done) => {
        service.legalRepresentatives$.subscribe((result) => {
          expect(result).toBeNull();
          done();
        });
      });
    });
  });

  describe("apprenticeships$", () => {
    let apprenticeships: ReadonlyArray<Apprenticeship>;
    beforeEach(() => {
      apprenticeships = [
        {
          apprenticeshipContract: buildApprenticeshipContract(123, 10, 20),
          jobTrainer: buildJobTrainer(10),
          apprenticeshipManager: buildApprenticeshipManager(20),
        },
      ];
      studentProfileServiceMock.getApprenticeships.and.returnValue(
        of(apprenticeships),
      );
    });

    describe("student", () => {
      beforeEach(() => {
        roles = "StudentRole";
      });

      it("emits apprenticeships", (done) => {
        service.apprenticeships$.subscribe((result) => {
          expect(result).toEqual(apprenticeships);
          done();
        });
      });
    });

    describe("teacher", () => {
      beforeEach(() => {
        roles = "TeacherRole";
      });

      it("emits null", (done) => {
        service.apprenticeships$.subscribe((apprenticeships) => {
          expect(apprenticeships).toBeNull();
          done();
        });
      });
    });
  });

  describe("stayPermit$", () => {
    it("emits stay permit for current person if available", (done) => {
      studentProfileServiceMock.getStayPermitValue.and.returnValue(
        of("Permit Value"),
      );
      service.stayPermit$.subscribe((result) => {
        expect(result).toBe("Permit Value");
        done();
      });
    });

    it("emits null if person is not available", (done) => {
      studentProfileServiceMock.getMyself.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 403 })),
      );
      studentProfileServiceMock.getStayPermitValue.and.returnValue(
        of("Permit Value"),
      );
      service.stayPermit$.subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });
  });
});
