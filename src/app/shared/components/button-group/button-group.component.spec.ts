import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import {
  ButtonGroupComponent,
  ButtonGroupOption,
} from "./button-group.component";

describe("ButtonGroupComponent", () => {
  let component: ButtonGroupComponent;
  let fixture: ComponentFixture<ButtonGroupComponent>;
  let options: ReadonlyArray<ButtonGroupOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroupComponent);
    component = fixture.componentInstance;

    options = [
      { key: "foo", label: "Foo" },
      { key: "bar", label: "Bar" },
      { key: "baz", label: "Baz" },
    ];
    fixture.componentRef.setInput("options", options);
    fixture.detectChanges();
  });

  it("renders a button for each option", () => {
    const buttons = fixture.debugElement.queryAll(By.css("button"));
    expect(buttons.length).toBe(3);
    expect(buttons[0].nativeElement.textContent?.trim()).toBe("Foo");
    expect(buttons[1].nativeElement.textContent?.trim()).toBe("Bar");
    expect(buttons[2].nativeElement.textContent?.trim()).toBe("Baz");
  });

  it("adds class 'active' to the selected option", () => {
    fixture.componentRef.setInput("selected", options[1].key);
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css("button"));
    expect(buttons[0].nativeElement.classList).not.toContain("active");
    expect(buttons[1].nativeElement.classList).toContain("active");
    expect(buttons[2].nativeElement.classList).not.toContain("active");
  });

  it("emits option when button is clicked", () => {
    const buttons = fixture.debugElement.queryAll(By.css("button"));
    buttons[1].nativeElement.click();
    expect(component.selected()).toBe(options[1].key);
  });
});
