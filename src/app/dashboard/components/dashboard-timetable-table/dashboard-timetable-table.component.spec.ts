import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DashboardService } from "../../services/dashboard.service";

import { DashboardTimetableTableComponent } from "./dashboard-timetable-table.component";

describe("DashboardTimetableTableComponent", () => {
  let component: DashboardTimetableTableComponent;
  let fixture: ComponentFixture<DashboardTimetableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DashboardTimetableTableComponent],
        providers: [
          {
            provide: DashboardService,
            useValue: {
              studentId$: of(123),
              hasLessonTeacherRole$: of(false),
              hasStudentRole$: of(false),
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardTimetableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
