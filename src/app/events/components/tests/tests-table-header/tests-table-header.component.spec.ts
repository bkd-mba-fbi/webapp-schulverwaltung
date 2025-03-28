import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestStateService } from "../../../services/test-state.service";
import { TestsTableHeaderComponent } from "./tests-table-header.component";

describe("TestsTableHeaderComponent", () => {
  let component: TestsTableHeaderComponent;
  let fixture: ComponentFixture<TestsTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestsTableHeaderComponent],
        providers: [
          {
            provide: TestStateService,
            useValue: {
              filteredTests$: of([]),
              filter$: of(""),
              expandedHeader$: of(false),
              toggleHeader() {},
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(TestsTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
