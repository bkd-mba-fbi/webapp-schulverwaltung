import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationGradeComponent } from "./evaluation-grade.component";

describe("EvaluationGradeComponent", () => {
  let component: EvaluationGradeComponent;
  let fixture: ComponentFixture<EvaluationGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationGradeComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationGradeComponent);
    component = fixture.componentInstance;

    const testOptions = [
      { Key: 1, Value: "A" },
      { Key: 2, Value: "B" },
      { Key: 3, Value: "C" },
    ];

    fixture.componentRef.setInput("options", testOptions);
    fixture.componentRef.setInput("value", 1);

    fixture.detectChanges();
  });

  it("debounces value changes by 1 second", fakeAsync(() => {
    component.onValueChange(2);

    expect(component.value()).toBe(1);

    tick(999);
    expect(component.value()).toBe(1);

    tick(1);
    expect(component.value()).toBe(2);
  }));

  it("debounces multiple changes within 1 second", fakeAsync(() => {
    component.onValueChange(2);

    tick(800);
    expect(component.value()).toBe(1);

    component.onValueChange(3);

    tick(200);
    expect(component.value()).toBe(1);

    tick(800);
    expect(component.value()).toBe(3);
  }));
});
