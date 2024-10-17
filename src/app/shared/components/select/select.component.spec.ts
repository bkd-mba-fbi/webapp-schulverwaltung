import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { SelectComponent } from "./select.component";

describe("SelectComponent", () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  // let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({ imports: [SelectComponent] }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    // element = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create default select component", () => {
    // then
    expect(component).toBeTruthy();
    expect(component.allowEmpty).toBeTruthy();
    expect(component.emptyLabel).toBe("");
    expect(component.options).toEqual([]);
    expect(component.value).toBeNull();
  });

  it("should create select component without element", () => {
    // given
    component.allowEmpty = false;

    // then
    expect(component.allowEmpty).toBeFalsy();
  });

  it("should create select component with custom empty element", () => {
    // given
    component.allowEmpty = true;
    component.emptyLabel = "Choose option...";

    // then
    expect(component.emptyLabel).toBe("Choose option...");
    expect(component.allowEmpty).toBeTruthy();
  });
});
