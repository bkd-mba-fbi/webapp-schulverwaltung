import { Component } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { DropDownItem } from "../../../../shared/models/drop-down-item.model";
import { EvaluationGradeComponent } from "./evaluation-grade.component";

@Component({
  selector: "bkd-select",
  template: "<div></div>",
})
class MockSelectComponent {
  options: DropDownItem[] = [];
  value: number | null = null;
  valueChange = jasmine.createSpy("valueChange");
}

describe("EvaluationGradeComponent", () => {
  let component: EvaluationGradeComponent;
  let fixture: ComponentFixture<EvaluationGradeComponent>;
  let valueChangeSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationGradeComponent],
      providers: [
        {
          provide: SelectComponent,
          useClass: MockSelectComponent,
        },
      ],
    })
      .overrideComponent(EvaluationGradeComponent, {
        remove: { imports: [SelectComponent] },
        add: { imports: [MockSelectComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EvaluationGradeComponent);
    component = fixture.componentInstance;

    const testOptions = [
      { Key: 1, Value: "A" },
      { Key: 2, Value: "B" },
      { Key: 3, Value: "C" },
    ];

    fixture.componentRef.setInput("options", testOptions);
    fixture.componentRef.setInput("value", 1);

    valueChangeSpy = spyOn(component.valueChange, "emit").and.callThrough();

    fixture.detectChanges();
  });

  it("should debounce value changes by 1 second", fakeAsync(() => {
    component.onValueChange(2);

    expect(valueChangeSpy).not.toHaveBeenCalled();

    tick(999);
    expect(valueChangeSpy).not.toHaveBeenCalled();

    tick(1);
    expect(valueChangeSpy).toHaveBeenCalledWith(2);
    expect(valueChangeSpy).toHaveBeenCalledTimes(1);
  }));

  it("should reset the debounce timer when multiple changes occur", fakeAsync(() => {
    component.onValueChange(2);

    tick(800);
    expect(valueChangeSpy).not.toHaveBeenCalled();

    component.onValueChange(3);

    tick(200);
    expect(valueChangeSpy).not.toHaveBeenCalledWith(2);

    tick(800);

    expect(valueChangeSpy).toHaveBeenCalledWith(3);
    expect(valueChangeSpy).toHaveBeenCalledTimes(1);
  }));
});
