import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestsTableFilterComponent } from "./tests-table-filter.component";

describe("TestsTableFilterComponent", () => {
  let component: TestsTableFilterComponent;
  let fixture: ComponentFixture<TestsTableFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestsTableFilterComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(TestsTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
