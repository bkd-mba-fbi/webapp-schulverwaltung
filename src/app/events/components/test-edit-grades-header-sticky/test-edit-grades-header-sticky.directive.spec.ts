import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { PortalService } from "src/app/shared/services/portal.service";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { TestStateService } from "../../services/test-state.service";
import { TestEditGradesHeaderStickyDirective } from "./test-edit-grades-header-sticky.directive";

describe("TestEditGradesHeaderStickyDirective", () => {
  it("should create an instance", () => {
    const testStateServiceMock = jasmine.createSpyObj<TestStateService>([
      "filteredTests$",
      "expandedHeader$",
    ]);
    testStateServiceMock.filteredTests$ = of([]);
    testStateServiceMock.expandedHeader$ = of(false);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          TestEditGradesHeaderStickyDirective,
          {
            provide: PortalService,
            useValue: new PortalService(),
          },
          {
            provide: TestStateService,
            useValue: testStateServiceMock,
          },
        ],
      }),
    );

    const directive = TestBed.inject(TestEditGradesHeaderStickyDirective);
    expect(directive).toBeTruthy();
  });
});
