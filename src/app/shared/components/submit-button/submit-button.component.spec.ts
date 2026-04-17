import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SubmitButtonComponent } from "./submit-button.component";

describe("SubmitButtonComponent", () => {
  let fixture: ComponentFixture<SubmitButtonComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitButtonComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it("is active and does not show spinner per default", () => {
    const button = element.querySelector<HTMLButtonElement>(".btn");
    expect(button?.disabled).toBeFalse();

    const spinner = element.querySelector(".spinner-border");
    expect(spinner).toBeNull();
  });

  it("is disabled and shows spinner when saving=true", () => {
    fixture.componentRef.setInput("saving", true);
    fixture.detectChanges();

    const button = element.querySelector<HTMLButtonElement>(".btn");
    expect(button?.disabled).toBeTrue();

    const spinner = element.querySelector(".spinner-border");
    expect(spinner).not.toBeNull();
  });

  it("is disabled and does not show spinner when disabled=true", () => {
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();

    const button = element.querySelector<HTMLButtonElement>(".btn");
    expect(button?.disabled).toBeTrue();

    const spinner = element.querySelector(".spinner-border");
    expect(spinner).toBeNull();
  });
});
