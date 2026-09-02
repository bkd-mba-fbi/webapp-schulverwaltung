import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MySettingsNotificationsToggleComponent } from "./my-settings-notifications-toggle.component";

describe("MySettingsNotificationsToggleComponent", () => {
  let component: MySettingsNotificationsToggleComponent;
  let fixture: ComponentFixture<MySettingsNotificationsToggleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MySettingsNotificationsToggleComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(MySettingsNotificationsToggleComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput("id", "custom-id");
    fixture.componentRef.setInput("label", "This is a label");
  });

  it("renders a label with the given text", async () => {
    await waitForRender();
    expect(element.querySelector("label")?.textContent).toContain(
      "This is a label",
    );
  });

  it("renders the description if available", async () => {
    fixture.componentRef.setInput("description", "This is a description");
    await waitForRender();
    expect(element.textContent).toContain("This is a description");
  });

  it("renders the toggle switch with the given id", async () => {
    await waitForRender();
    const input = getInput();
    expect(input?.id).toBe("custom-id");
    expect(input?.disabled).toBe(false);
  });

  it("renders disabled toggle switch", async () => {
    fixture.componentRef.setInput("disabled", true);
    await waitForRender();
    const input = getInput();
    expect(input?.disabled).toBe(true);
  });

  it("renders the toggle switch with given value", async () => {
    await waitForRender();
    const input = getInput();
    expect(input?.checked).toBe(false);

    component.writeValue(true);
    await waitForRender();
    expect(input?.checked).toBe(true);

    component.writeValue(false);
    await waitForRender();
    expect(input?.checked).toBe(false);
  });

  it("updates the value on toggle switch click", async () => {
    await waitForRender();
    const input = getInput();
    expect(input?.checked).toBe(false);

    input.click();
    expect(component.value).toBe(true);
  });

  function getInput(): HTMLInputElement {
    const input = element.querySelector<HTMLInputElement>("input");
    expect(input).toBeDefined();
    return input!;
  }

  function waitForRender() {
    fixture.detectChanges();
    return fixture.whenStable();
  }
});
