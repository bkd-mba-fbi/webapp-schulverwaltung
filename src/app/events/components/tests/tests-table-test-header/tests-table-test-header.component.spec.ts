import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestTableHeaderComponent } from "./tests-table-test-header.component";

describe("TestsTableTestHeaderComponent", () => {
  let component: TestTableHeaderComponent;
  let fixture: ComponentFixture<TestTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestTableHeaderComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    const test = buildTest(123, 345, []);
    fixture = TestBed.createComponent(TestTableHeaderComponent);
    component = fixture.componentInstance;
    component.test = test;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
