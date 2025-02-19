import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { NotificationComponent } from "./notification.component";

describe("NotificationComponent", () => {
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [NotificationComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    fixture.componentRef.setInput("message", "message");
    fixture.detectChanges();
  });

  it("renders the success notification by default", () => {
    const notification = fixture.debugElement.query(By.css(".success"));
    expect(notification).not.toBeNull();
  });

  it("renders the message", () => {
    const notification = fixture.nativeElement.textContent;
    expect(notification).toContain("message");
  });

  it("renders the success notification", () => {
    fixture.componentRef.setInput("type", "success");
    fixture.detectChanges();

    const notification = fixture.debugElement.query(By.css(".success"));
    expect(notification).not.toBeNull();
  });

  it("renders the error notification", () => {
    fixture.componentRef.setInput("type", "error");
    fixture.detectChanges();

    const notification = fixture.debugElement.query(By.css(".error"));
    expect(notification).not.toBeNull();
  });

  it("renders an optional title", () => {
    fixture.componentRef.setInput("title", "title");
    fixture.detectChanges();

    const notification = fixture.nativeElement.textContent;
    expect(notification).toContain("title");
  });

  it("renders an optional action", () => {
    fixture.componentRef.setInput("actionLabel", "actionLabel");
    fixture.detectChanges();

    const notification = fixture.nativeElement.textContent;
    const button = fixture.debugElement.query(By.css("button"));
    expect(notification).toContain("actionLabel");
    expect(button).not.toBeNull();
  });
});
