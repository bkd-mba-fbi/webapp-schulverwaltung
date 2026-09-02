import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MultiselectComponent } from "./multiselect.component";

describe("MultiselectComponent", () => {
  let component: MultiselectComponent;
  let fixture: ComponentFixture<MultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MultiselectComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("emits values on itemsChanged", () => {
    fixture.componentRef.setInput("values", [1, 2]);

    fixture.detectChanges();
    expect(component.values()).toEqual([1, 2]);

    component.intermediateValues.set([1, 2, 3]);

    fixture.detectChanges();
    expect(component.values()).toEqual([1, 2]);

    component.itemsChanged();
    expect(component.values()).toEqual([1, 2, 3]);
  });
});
