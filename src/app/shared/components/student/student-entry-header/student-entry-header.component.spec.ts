import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../../spec-helpers";
import { StudentEntryHeaderComponent } from "./student-entry-header.component";

describe("StudentEntryHeaderComponent", () => {
  let component: StudentEntryHeaderComponent;
  let fixture: ComponentFixture<StudentEntryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentEntryHeaderComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEntryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
