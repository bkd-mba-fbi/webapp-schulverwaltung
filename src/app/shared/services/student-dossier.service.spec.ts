import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { StudentDossierService } from "./student-dossier.service";
import { StudentStateService } from "./student-state.service";
import { StudentsRestService } from "./students-rest.service";

describe("StudentDossierService", () => {
  let service: StudentDossierService;
  let stateServiceMock: StudentStateService;
  let studentsRestServiceMock: jasmine.SpyObj<StudentsRestService>;
  let dropDownItemsServiceMock: jasmine.SpyObj<DropDownItemsRestService>;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: StudentStateService,
            useFactory: () => {
              stateServiceMock = {} as StudentStateService;
              stateServiceMock.studentId$ = of(42);
              return stateServiceMock;
            },
          },
          {
            provide: StudentsRestService,
            useFactory: () => {
              studentsRestServiceMock =
                jasmine.createSpyObj<StudentsRestService>(
                  "StudentsRestService",
                  ["getAdditionalInformations"],
                );
              return studentsRestServiceMock;
            },
          },
          {
            provide: StudentsRestService,
            useFactory: () => {
              dropDownItemsServiceMock =
                jasmine.createSpyObj<DropDownItemsRestService>(
                  "DropDownItemsRestService",
                  ["getAdditionalInformationCodes"],
                );
              return dropDownItemsServiceMock;
            },
          },
        ],
      }),
    );
    service = TestBed.inject(StudentDossierService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
