import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyAbsencesService } from "../../services/my-absences.service";
import { MyAbsencesConfirmComponent } from "./my-absences-confirm.component";

describe("MyAbsencesConfirmComponent", () => {
  let component: MyAbsencesConfirmComponent;
  let fixture: ComponentFixture<MyAbsencesConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyAbsencesConfirmComponent],
        providers: [
          {
            provide: MyAbsencesService,
            useValue: {
              openAbsences$: of([]),
              counts$: of({}),
            },
          },
          {
            provide: ConfirmAbsencesSelectionService,
            useValue: {
              selectedIds$: of([{ lessonIds: [1], personIds: [1] }]),
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
