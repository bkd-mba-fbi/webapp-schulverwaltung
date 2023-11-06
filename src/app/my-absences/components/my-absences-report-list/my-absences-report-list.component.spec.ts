import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyAbsencesReportSelectionService } from "../../services/my-absences-report-selection.service";
import { MyAbsencesReportStateService } from "../../services/my-absences-report-state.service";
import { MyAbsencesReportHeaderComponent } from "../my-absences-report-header/my-absences-report-header.component";
import { MyAbsencesReportListComponent } from "./my-absences-report-list.component";

describe("MyAbsencesReportListComponent", () => {
  let component: MyAbsencesReportListComponent;
  let fixture: ComponentFixture<MyAbsencesReportListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          MyAbsencesReportListComponent,
          MyAbsencesReportHeaderComponent,
        ],
        providers: [
          {
            provide: MyAbsencesReportStateService,
            useValue: {
              loading$: of(false),
              loadingPage$: of(false),
              entries$: of([]),
              presenceTypes$: of([]),
              selected: [],
              setFilter: jasmine.createSpy("setFilter"),
              isFilterValid$: of(true),
              validFilter$: of({}),
            },
          },
          MyAbsencesReportSelectionService,
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
