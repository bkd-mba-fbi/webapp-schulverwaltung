import { computed } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentAbsencesService } from "../../../services/student-absences.service";
import { StudentStateService } from "../../../services/student-state.service";
import { StudentAbsencesComponent } from "./student-absences.component";

describe("StudentAbsencesComponent", () => {
  let component: StudentAbsencesComponent;
  let fixture: ComponentFixture<StudentAbsencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentAbsencesComponent],
        providers: [StudentStateService, ConfirmAbsencesSelectionService],
      }),
    )
      .overrideComponent(StudentAbsencesComponent, {
        set: {
          providers: [
            {
              provide: StudentAbsencesService,
              useValue: {
                counts$: computed(() => ({ checkableAbsences: null })),
                setStudentId: jasmine.createSpy("setStudentId"),
              },
            },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
