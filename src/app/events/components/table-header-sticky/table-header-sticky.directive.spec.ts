import { TestBed } from "@angular/core/testing";
import { PortalService } from "src/app/shared/services/portal.service";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { TableHeaderStickyDirective } from "./table-header-sticky.directive";

describe("TableHeaderStickyDirective", () => {
  it("should create an instance", () => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          TableHeaderStickyDirective,
          {
            provide: PortalService,
            useValue: new PortalService(),
          },
        ],
      }),
    );

    const directive = TestBed.inject(TableHeaderStickyDirective);
    expect(directive).toBeTruthy();
  });
});
