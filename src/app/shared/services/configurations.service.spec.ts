import { TestBed } from "@angular/core/testing";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { SchoolAppNavigation } from "../models/configurations.model";
import { ConfigurationsRestService } from "./configurations-rest.service";
import { ConfigurationsService } from "./configurations.service";

describe("ConfigurationsService", () => {
  let service: ConfigurationsService;
  let schoolAppNavigation$: BehaviorSubject<SchoolAppNavigation>;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          ConfigurationsService,
          {
            provide: ConfigurationsRestService,
            useFactory() {
              schoolAppNavigation$ = new BehaviorSubject<SchoolAppNavigation>({
                practicalTrainerActionEMail: true,
              });
              return {
                getSchoolAppNavigation() {
                  return schoolAppNavigation$.asObservable();
                },
              };
            },
          },
        ],
      }),
    );
    service = TestBed.inject(ConfigurationsService);
  });

  describe("canEditInstructorEmail$", () => {
    it("emits true if practicalTrainerActionEMail is true", async () => {
      schoolAppNavigation$.next({ practicalTrainerActionEMail: true });

      const result = await firstValueFrom(service.canEditInstructorEmail$);
      expect(result).toBeTrue();
    });

    it("emits false if practicalTrainerActionEMail is false", async () => {
      schoolAppNavigation$.next({ practicalTrainerActionEMail: false });

      const result = await firstValueFrom(service.canEditInstructorEmail$);
      expect(result).toBeFalse();
    });
  });
});
