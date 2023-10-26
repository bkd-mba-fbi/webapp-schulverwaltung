import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TypeaheadComponent } from "./typeahead.component";
import { buildTestModuleMetadata } from "src/spec-helpers";

describe("TypeaheadComponent", () => {
  let component: TypeaheadComponent;
  let fixture: ComponentFixture<TypeaheadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({}),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
