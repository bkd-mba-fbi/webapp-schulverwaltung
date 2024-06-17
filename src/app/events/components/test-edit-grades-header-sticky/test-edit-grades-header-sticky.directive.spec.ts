import { of } from "rxjs";
import { PortalService } from "src/app/shared/services/portal.service";
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

    const directive = new TestEditGradesHeaderStickyDirective(
      new PortalService(),
      testStateServiceMock,
    );
    expect(directive).toBeTruthy();
  });
});
