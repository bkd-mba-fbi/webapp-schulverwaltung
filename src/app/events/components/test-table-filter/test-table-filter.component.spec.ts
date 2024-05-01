import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestTableFilterComponent } from "./test-table-filter.component";

describe("TestTableFilterComponent", () => {
  let component: TestTableFilterComponent;
  let fixture: ComponentFixture<TestTableFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestTableFilterComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(TestTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
