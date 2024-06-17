import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestStateService } from "../../services/test-state.service";
import { TestEditGradesHeaderComponent } from "./test-edit-grades-header.component";

describe("TestEditGradesHeaderComponent", () => {
  let component: TestEditGradesHeaderComponent;
  let fixture: ComponentFixture<TestEditGradesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestEditGradesHeaderComponent],
        providers: [
          {
            provide: TestStateService,
            useValue: {
              filteredTests$: of([]),
              filter$: of(""),
              expandedHeader$: of(false),
              toggleHeader() {},
              getSortingChar$() {
                return of("");
              },
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(TestEditGradesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
