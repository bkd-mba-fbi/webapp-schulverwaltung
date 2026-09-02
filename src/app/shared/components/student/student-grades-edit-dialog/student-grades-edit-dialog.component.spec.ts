import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks,
  tick,
} from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentGradesEditDialogComponent } from "./student-grades-edit-dialog.component";

const DEBOUNCE_TIME = 500;

describe("StudentGradesEditDialogComponent", () => {
  let fixture: ComponentFixture<StudentGradesEditDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentGradesEditDialogComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradesEditDialogComponent);
    element = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput("test", {
      ...buildTest(1, 1, []),
      IsPointGrading: true,
    });
    fixture.componentRef.setInput("gradeId", 1234);
    fixture.componentRef.setInput("gradeOptions", [
      { Key: 1234, Value: "4.5" },
    ]);
    fixture.componentRef.setInput("points", null);
    fixture.componentRef.setInput("studentId", 4321);
    fixture.detectChanges();
  });

  describe("grading scale disabled state", () => {
    it("is enabled if no points are set", fakeAsync(() => {
      flushMicrotasks();
      expect(getGradeSelect()?.disabled).toBe(false);
    }));

    it("is disabled if points are set", fakeAsync(() => {
      fixture.componentRef.setInput("points", 5);
      fixture.detectChanges();
      flushMicrotasks();

      expect(getGradeSelect()?.disabled).toBe(true);
    }));

    it("is disabled as soon as points are entered, without waiting for the debounce", fakeAsync(() => {
      enterPoints("5");
      expect(getGradeSelect()?.disabled).toBe(true);

      tick(DEBOUNCE_TIME);
    }));

    it("is enabled again as soon as the points are cleared", fakeAsync(() => {
      enterPoints("5");
      tick(DEBOUNCE_TIME); // the points are saved
      expect(getGradeSelect()?.disabled).toBe(true);

      enterPoints("");
      expect(getGradeSelect()?.disabled).toBe(false);

      tick(DEBOUNCE_TIME);
    }));

    it("is enabled again for invalid points", fakeAsync(() => {
      enterPoints("5");
      tick(DEBOUNCE_TIME); // the points are saved
      expect(getGradeSelect()?.disabled).toBe(true);

      enterPoints("abc");
      expect(getGradeSelect()?.disabled).toBe(false);

      tick(DEBOUNCE_TIME);
    }));

    it("is enabled for zero points", fakeAsync(() => {
      enterPoints("0");
      expect(getGradeSelect()?.disabled).toBe(false);

      tick(DEBOUNCE_TIME);
    }));
  });

  /**
   * Enters the given value into the points input and flushes the microtask in
   * which `NgModel` applies the disabled state, but not the debounce timer.
   */
  function enterPoints(value: string): void {
    const input = element.querySelector<HTMLInputElement>("input#points");
    expect(input).not.toBeNull();

    input!.value = value;
    input!.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    flushMicrotasks();
  }

  function getGradeSelect(): Option<HTMLSelectElement> {
    return element.querySelector("select#grade");
  }
});
