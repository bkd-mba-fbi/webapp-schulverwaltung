import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TypeaheadComponent } from "./typeahead.component";

describe("TypeaheadComponent", () => {
  let component: TypeaheadComponent;
  let fixture: ComponentFixture<TypeaheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({ imports: [TypeaheadComponent] }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
